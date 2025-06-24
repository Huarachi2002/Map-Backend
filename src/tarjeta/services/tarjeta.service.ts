import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ExchangeRequest, RecargaTarjetaDto } from "../interface/tarjeta.interface";
import { PrismaService } from "src/prisma/services";
import { BlockchainService } from "src/blockchain/services/blockchain.service";
import { Movimiento, Tarjeta, TransaccionBlockchain } from "@prisma/client";


@Injectable()
export class TarjetaService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly blockchainService: BlockchainService,
    ) {}

    public async recargaTarjeta(recargaDto: RecargaTarjetaDto): Promise<{
        tarjeta: Tarjeta;
        movimiento: Movimiento;
        transaccion: TransaccionBlockchain;
    }> {
        // 1. Verificar que la tarjeta existe
        const tarjeta = await this.prismaService.tarjeta.findUnique({
            where: { id: recargaDto.id_tarjeta },
            include: { cliente: { include: { usuario: true } } }
        });

        if (!tarjeta || !tarjeta.estado) {
            throw new NotFoundException('Tarjeta no encontrada o inactiva');
        }

        // 2. Calcular el monto en bolivianos
        const montoBolivianos = recargaDto.monto_cripto * recargaDto.tasa_conversion;
        
        // 3. Crear ID único para el exchange
        const exchangeId = `exchange_${Date.now()}_${tarjeta.id}`;

        // 4. Preparar datos para el blockchain
        const exchangeRequest: ExchangeRequest = {
            fromAddress: tarjeta.cliente.wallet_address,
            toAddress: process.env.APP_WALLET_ADDRESS, // Wallet de la aplicación
            cryptoAmount: recargaDto.monto_cripto,
            cryptoType: recargaDto.tipo_cripto,
            bolivianosAmount: montoBolivianos,
            exchangeId
        };

        try {
            // 5. Procesar exchange en blockchain
            const blockchainResponse = await this.blockchainService.processExchange(exchangeRequest);

            if (!blockchainResponse.success || !blockchainResponse.txHash) {
                throw new BadRequestException(`Error en el exchange: ${blockchainResponse.error}`);
            }

            // 6. Actualizar datos en la base de datos usando transacción
            const result = await this.prismaService.$transaction(async (tx) => {
                // Crear registro de transacción blockchain
                const transaccionBlockchain = await tx.transaccionBlockchain.create({
                data: {
                    tipo_transaccion: 'EXCHANGE_RECARGA',
                    tx_hash: blockchainResponse.txHash,
                    cripto_usada: recargaDto.tipo_cripto,
                    monto_original: recargaDto.monto_cripto,
                    gas_fee: blockchainResponse.gasFee || 0,
                    direccion_origen: tarjeta.cliente.wallet_address,
                    direccion_destino: process.env.APP_WALLET_ADDRESS,
                }
                });

                // Crear movimiento
                const movimiento = await tx.movimiento.create({
                data: {
                    id_tarjeta: recargaDto.id_tarjeta,
                    monto_cripto: recargaDto.monto_cripto,
                    monto_convertido: montoBolivianos,
                    tasa_conversion: recargaDto.tasa_conversion,
                    TransaccionBlockchain: {
                    connect: { id: transaccionBlockchain.id }
                    }
                }
                });

                // Actualizar saldo de la tarjeta
                const tarjetaActualizada = await tx.tarjeta.update({
                where: { id: recargaDto.id_tarjeta },
                data: { 
                    saldo_actual: { increment: montoBolivianos }
                },
                include: { cliente: { include: { usuario: true } } }
                });

                return { tarjetaActualizada, movimiento, transaccionBlockchain };
            });

            return {
                tarjeta: result.tarjetaActualizada,
                movimiento: result.movimiento,
                transaccion: result.transaccionBlockchain
            };

        } catch (error) {
            throw new BadRequestException(`Error procesando recarga: ${error.message}`);
        }
    }

    public async procesarPago(pagoDto: { id_tarjeta: string; monto: number }): Promise<Movimiento> {
        const tarjeta = await this.prismaService.tarjeta.findUnique({
            where: { id: pagoDto.id_tarjeta },
            include: { cliente: { include: { usuario: true } } }
        });

        if (!tarjeta || !tarjeta.estado) {
            throw new NotFoundException('Tarjeta no encontrada o inactiva');
        }

        if (tarjeta.saldo_actual < pagoDto.monto) {
            throw new BadRequestException('Saldo insuficiente en la tarjeta');
        }

        const result = await this.prismaService.$transaction(async (tx) => {
            // Crear movimiento de pago
            const movimiento = await tx.movimiento.create({
                data: {
                    id_tarjeta: pagoDto.id_tarjeta,
                    monto_cripto: 0, // No aplica para pagos
                    monto_convertido: pagoDto.monto,
                    tasa_conversion: 1, // No aplica para pagos
                }
            });

            // Actualizar saldo de la tarjeta
            await tx.tarjeta.update({
                where: { id: pagoDto.id_tarjeta },
                data: { 
                    saldo_actual: { decrement: pagoDto.monto }
                },
                include: { cliente: { include: { usuario: true } } }
            });

            return movimiento;
        });

        return result;
    }

    public async crearTarjeta(id_cliente: string, tipo_tarjeta: string): Promise<Tarjeta> {
        return this.prismaService.tarjeta.create({
            data: {
                id_cliente,
                tipo_tarjeta,
                saldo_actual: 0,
                estado: true
            },
            include: { cliente: { include: { usuario: true } } }
        });
    }

    public async obtenerTarjetasCliente(id_cliente: string): Promise<Tarjeta[]> {
        return this.prismaService.tarjeta.findMany({
            where: { id_cliente },
            include: {
                movimientos: {
                include: { TransaccionBlockchain: true },
                orderBy: { createdAt: 'desc' }
                }
            }
        });
    }

    public async obtenerHistorialMovimientos(id_tarjeta: string): Promise<Movimiento[]> {
        return this.prismaService.movimiento.findMany({
            where: { id_tarjeta },
            include: { TransaccionBlockchain: true },
            orderBy: { createdAt: 'desc' }
        });
    }
}