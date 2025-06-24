import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { BlockchainResponse, ExchangeRequest } from '../interface/payment.interface';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { WithdrawalRequest } from 'src/entidad-operadora/interface';



@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  private readonly blockchainUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.blockchainUrl = this.configService.get<string>('BLOCKCHAIN_SERVICE_URL') || 'http://localhost:3002';
  }

  public async processExchange(exchangeRequest: ExchangeRequest): Promise<BlockchainResponse> {
    try {
      this.logger.log(`Procesando exchange: ${JSON.stringify(exchangeRequest)}`);
      
      const response = await firstValueFrom(
        this.httpService.post(`${this.blockchainUrl}/process-exchange`, exchangeRequest)
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Error procesando exchange: ${error.message}`);
      throw new BadRequestException(`Error en el exchange: ${error.message}`);
    }
  }

  public async processWithdrawal(withdrawalRequest: WithdrawalRequest): Promise<BlockchainResponse> {
    try {
      this.logger.log(`Procesando retiro: ${JSON.stringify(withdrawalRequest)}`);
      
      const response = await firstValueFrom(
        this.httpService.post(`${this.blockchainUrl}/process-withdrawal`, withdrawalRequest)
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Error procesando retiro: ${error.message}`);
      throw new BadRequestException(`Error en el retiro: ${error.message}`);
    }
  }

  public async processPayment(paymentRequest: PaymentRequest): Promise<BlockchainResponse> {
    try {
      this.logger.log(`Procesando pago: ${JSON.stringify(paymentRequest)}`);
      
      const response = await firstValueFrom(
        this.httpService.post(`${this.blockchainUrl}/process-payment`, paymentRequest)
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Error procesando pago: ${error.message}`);
      throw new BadRequestException(`Error en el procesamiento del pago: ${error.message}`);
    }
  }

  public async getExchangeRates(): Promise<{ [key: string]: number }> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.blockchainUrl}/exchange-rates`)
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Error obteniendo tasas de cambio: ${error.message}`);
      throw new BadRequestException(`Error obteniendo tasas de cambio: ${error.message}`);
    }
  }
}