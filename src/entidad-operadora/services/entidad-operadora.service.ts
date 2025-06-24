import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EntidadOperadora, RetiroEntidad, TransaccionBlockchain } from '@prisma/client';
import { PrismaService } from 'src/prisma/services';
import { QueryCommonDto } from 'src/common/dto';
import { EntidadOperadoraCreateDto, EntidadOperadoraUpdateDto } from '../dto';
import { BlockchainService } from 'src/blockchain/services/blockchain.service';
import { SolicitudRetiroDto, WithdrawalRequest } from '../interface';

@Injectable()
export class EntidadOperadoraService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly blockchainService: BlockchainService,
  ) {}

  public async findAll({
    search,
    skip,
    limit
  }: QueryCommonDto): Promise<EntidadOperadora[]> {
    const entidades = await this.prismaService.entidadOperadora.findMany({
      where: {
        nombre: {
          contains: search,
          mode: "insensitive"
        }
      },
      skip,
      take: limit
    });
    return entidades;
  }

  public async countAll({
    search
  }: QueryCommonDto): Promise<number> {
    const count = await this.prismaService.entidadOperadora.count({
      where: {
        nombre: {
          contains: search,
          mode: "insensitive"
        }
      }
    });
    return count;
  }

  public async findById(id: string): Promise<EntidadOperadora> {
    const entidad = await this.prismaService.entidadOperadora.findUnique({
      where: {
        id
      },
      include: {
        empleados: {
          include: {
            usuario: true
          }
        }
      }
    });
    
    if (!entidad) {
      throw new NotFoundException(`Entidad Operadora con ID ${id} no encontrada`);
    }
    
    return entidad;
  }

  public async create(entidadDto: EntidadOperadoraCreateDto): Promise<EntidadOperadora> {
    // Verificar que el nombre no esté en uso
    const existingEntidad = await this.prismaService.entidadOperadora.findFirst({
      where: {
        nombre: {
          equals: entidadDto.nombre,
          mode: 'insensitive'
        }
      }
    });
    
    if (existingEntidad) {
      throw new BadRequestException(`La entidad con nombre ${entidadDto.nombre} ya existe`);
    }
    
    const entidad = await this.prismaService.entidadOperadora.create({
      data: {
        nombre: entidadDto.nombre,
        tipo: entidadDto.tipo,
        correo_contacto: entidadDto.correo_contacto,
        wallet_address: entidadDto.wallet_address,
        direccion: entidadDto.direccion
      }
    });
    
    return entidad;
  }

  public async update(id: string, entidadDto: EntidadOperadoraUpdateDto): Promise<EntidadOperadora> {
    // Verificar que la entidad existe
    await this.findById(id);
    
    // Verificar que el nombre no esté en uso por otra entidad
    if (entidadDto.nombre) {
      const existingEntidad = await this.prismaService.entidadOperadora.findFirst({
        where: {
          nombre: {
            equals: entidadDto.nombre,
            mode: 'insensitive'
          },
          NOT: {
            id
          }
        }
      });
      
      if (existingEntidad) {
        throw new BadRequestException(`La entidad con nombre ${entidadDto.nombre} ya existe`);
      }
    }
    
    const updatedEntidad = await this.prismaService.entidadOperadora.update({
      where: {
        id
      },
      data: {
        nombre: entidadDto.nombre,
        tipo: entidadDto.tipo,
        direccion: entidadDto.direccion,
        correo_contacto: entidadDto.correo_contacto,
        wallet_address: entidadDto.wallet_address,
        saldo_ingresos: entidadDto.saldo_ingresos,
        estado: entidadDto.estado
      }
    });
    
    return updatedEntidad;
  }

  public async delete(id: string): Promise<EntidadOperadora> {
    // Verificar que la entidad existe
    await this.findById(id);
    
    // Verificar si tiene empleados activos
    const empleadosActivos = await this.prismaService.empleado.count({
      where: {
        id_entidad: id,
        usuario: {
          estado: true
        }
      }
    });
    
    if (empleadosActivos > 0) {
      throw new BadRequestException(`No se puede eliminar la entidad porque tiene ${empleadosActivos} empleados activos`);
    }
    
    const deletedEntidad = await this.prismaService.entidadOperadora.delete({
      where: {
        id
      }
    });
    
    return deletedEntidad;
  }

  public async procesarRetiro(solicitudDto: SolicitudRetiroDto): Promise<{
    retiro: RetiroEntidad;
    transaccion: TransaccionBlockchain;
  }> {
    // 1. Verificar que la entidad existe y tiene saldo suficiente
    const entidad = await this.prismaService.entidadOperadora.findUnique({
      where: { id: solicitudDto.id_entidad }
    });

    if (!entidad) {
      throw new NotFoundException('Entidad operadora no encontrada');
    }

    if (entidad.saldo_ingresos < solicitudDto.monto_bolivianos) {
      throw new BadRequestException('Saldo insuficiente para el retiro');
    }

    // 2. Calcular monto en criptomonedas
    const montoCripto = solicitudDto.monto_bolivianos * solicitudDto.tasa_conversion;

    // 3. Crear ID único para el retiro
    const withdrawalId = `withdrawal_${Date.now()}_${entidad.id}`;

    // 4. Preparar datos para el blockchain
    const withdrawalRequest: WithdrawalRequest = {
      toAddress: solicitudDto.wallet_destino,
      cryptoAmount: montoCripto,
      cryptoType: solicitudDto.tipo_cripto_destino,
      bolivianosAmount: solicitudDto.monto_bolivianos,
      withdrawalId
    };

    try {
      // 5. Procesar retiro en blockchain
      const blockchainResponse = await this.blockchainService.processWithdrawal(withdrawalRequest);

      if (!blockchainResponse.success || !blockchainResponse.txHash) {
        throw new BadRequestException(`Error en el retiro: ${blockchainResponse.error}`);
      }

      // 6. Actualizar datos en la base de datos
      const result = await this.prismaService.$transaction(async (tx) => {
        // Crear registro de transacción blockchain
        const transaccionBlockchain = await tx.transaccionBlockchain.create({
          data: {
            tipo_transaccion: 'RETIRO_ENTIDAD',
            tx_hash: blockchainResponse.txHash,
            cripto_usada: solicitudDto.tipo_cripto_destino,
            monto_original: montoCripto,
            gas_fee: blockchainResponse.gasFee || 0,
            direccion_origen: process.env.APP_WALLET_ADDRESS,
            direccion_destino: solicitudDto.wallet_destino,
          }
        });

        // Crear registro de retiro
        const retiro = await tx.retiroEntidad.create({
          data: {
            id_entidad: solicitudDto.id_entidad,
            monto_cripto: montoCripto,
            monto_convertido: solicitudDto.monto_bolivianos,
            tasa_conversion: solicitudDto.tasa_conversion,
            transaccion_blockchain: {
              connect: { id: transaccionBlockchain.id }
            }
          }
        });

        // Actualizar saldo de la entidad
        await tx.entidadOperadora.update({
          where: { id: solicitudDto.id_entidad },
          data: { 
            saldo_ingresos: { decrement: solicitudDto.monto_bolivianos }
          }
        });

        return { retiro, transaccionBlockchain };
      });

      return {
        retiro: result.retiro,
        transaccion: result.transaccionBlockchain
      };

    } catch (error) {
      throw new BadRequestException(`Error procesando retiro: ${error.message}`);
    }
  }

  public async obtenerRetirosEntidad(id_entidad: string): Promise<RetiroEntidad[]> {
    return this.prismaService.retiroEntidad.findMany({
      where: { id_entidad },
      include: { transaccion_blockchain: true },
      orderBy: { createdAt: 'desc' }
    });
  }
}
