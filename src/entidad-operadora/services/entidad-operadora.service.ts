import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EntidadOperadora, RetiroEntidad, TransaccionBlockchain } from '@prisma/client';
import { PrismaService } from 'src/prisma/services';
import { QueryCommonDto } from 'src/common/dto';
import { EntidadOperadoraCreateDto, EntidadOperadoraUpdateDto } from '../dto';
import { BlockchainService } from 'src/blockchain/services/blockchain.service';
import { SolicitudRetiroDto, WithdrawalRequest } from '../interface';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EntidadOperadoraService {
  private readonly logger = new Logger(EntidadOperadoraService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly blockchainService: BlockchainService,
    private readonly httpService: HttpService,
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
        direccion: entidadDto.direccion,
        id_divisa: entidadDto.id_divisa,
      }
    });
    
    return entidad;
  }

  public async obtenerTarifaEntidad(id_entidad: string): Promise<number> {
    const entidad = await this.prismaService.entidadOperadora.findUnique({
      where: { id: id_entidad },
    });

    if (!entidad) {
      throw new NotFoundException(`Entidad operadora con ID ${id_entidad} no encontrada`);
    }

    const tarifaBase = entidad.cobro_pasaje;

    const factorTiempo = this.calcularFactorTiempo();
    const factorClima = await this.calcularFactorClima(entidad.latitud, entidad.longitud);

    return tarifaBase * factorTiempo * factorClima;
  }


  private calcularFactorTiempo(): number {
    const horaActual = new Date().getHours();
    
    // Horas pico: 7-9 AM y 5-7 PM
    if ((horaActual >= 7 && horaActual <= 9) || (horaActual >= 17 && horaActual <= 19)) {
      return 1.3; // 30% más caro en hora pico
    }
    
    // Horas valle: 10 PM - 5 AM
    if (horaActual >= 22 || horaActual <= 5) {
      return 0.9; // 10% más barato
    }
    
    return 1.0; // Precio normal
  }

  private async calcularFactorClima(lat: number, lon: number): Promise<number> {
    try {
      // Llamada a la API de Open-Meteo con más parámetros climáticos
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,weather_code,wind_speed_10m&timezone=auto`;
      
      const response = await firstValueFrom(
        this.httpService.get(url)
      );
      
      const data = response.data;
      const current = data.current;
      
      // Extraer variables climáticas
      const temperatura = current.temperature_2m; // °C
      const precipitacion = current.precipitation || 0; // mm
      const codigoClima = current.weather_code; // Código WMO
      const velocidadViento = current.wind_speed_10m || 0; // km/h
      
      // Calcular factor basado en múltiples condiciones
      let factor = 1.0;
      
      // 1. Factor por temperatura (Bolivia: clima templado ideal 15-25°C)
      factor *= this.calcularFactorTemperatura(temperatura);
      
      // 2. Factor por precipitación
      factor *= this.calcularFactorPrecipitacion(precipitacion);
      
      // 3. Factor por viento
      factor *= this.calcularFactorViento(velocidadViento);
      
      // Logging para debug
      this.logger.log(`Factor clima calculado: ${factor} (T:${temperatura}°C, P:${precipitacion}mm, WC:${codigoClima}, W:${velocidadViento}km/h)`);
      
      // Limitar factor entre 0.8 y 2.5
      return Math.max(0.8, Math.min(2.5, factor));
      
    } catch (error) {
      this.logger.error('Error calculando factor clima:', error);
      // En caso de error, retornar factor neutro
      return 1.0;
    }
  }

  private calcularFactorTemperatura(temperatura: number): number {
    // Temperaturas extremas incrementan la demanda de transporte
    if (temperatura < 5 || temperatura > 30) {
      return 1.3; // +30% por temperaturas extremas
    }
    
    if (temperatura < 10 || temperatura > 25) {
      return 1.15; // +15% por temperaturas incómodas
    }
    
    // Temperatura ideal (15-25°C) - factor normal
    return 1.0;
  }

  private calcularFactorPrecipitacion(precipitacion: number): number {
    if (precipitacion > 10) {
      return 1.5; // +50% por lluvia intensa
    }
    
    if (precipitacion > 2) {
      return 1.25; // +25% por lluvia moderada
    }
    
    if (precipitacion > 0) {
      return 1.1; // +10% por lluvia ligera
    }
    
    return 1.0; // Sin lluvia
  }

  private calcularFactorViento(velocidadViento: number): number {
    // Viento fuerte hace que la gente prefiera transporte
    if (velocidadViento > 40) {
      return 1.25; // +25% por viento muy fuerte
    }
    
    if (velocidadViento > 25) {
      return 1.15; // +15% por viento fuerte
    }
    
    return 1.0; // Viento normal
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

    if (entidad.saldo_ingresos < solicitudDto.monto) {
      throw new BadRequestException('Saldo insuficiente para el retiro');
    }

    // 2. Calcular monto en criptomonedas
    const montoCripto = solicitudDto.monto * solicitudDto.tasa_conversion;

    // 3. Crear ID único para el retiro
    const withdrawalId = `withdrawal_${Date.now()}_${entidad.id}`;

    // 4. Preparar datos para el blockchain
    const withdrawalRequest: WithdrawalRequest = {
      toAddress: entidad.wallet_address,
      cryptoAmount: montoCripto,
      cryptoType: solicitudDto.tipo_cripto_destino,
      amount: solicitudDto.monto,
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
            direccion_destino: entidad.wallet_address,
          }
        });

        // Crear registro de retiro
        const retiro = await tx.retiroEntidad.create({
          data: {
            id_entidad: solicitudDto.id_entidad,
            monto_cripto: montoCripto,
            monto_convertido: solicitudDto.monto,
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
            saldo_ingresos: { decrement: solicitudDto.monto * solicitudDto.tasa_conversion }
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
