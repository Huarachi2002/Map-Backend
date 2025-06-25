import { EntidadOperadora } from "@prisma/client";

export interface IResponseEntidadOperadora {
  entidad: EntidadOperadora & {
    empleados?: any[];
  };
}

export interface SolicitudRetiroDto {
  id_entidad: string;
  monto: number;
  tipo_cripto_destino: string;
  tasa_conversion: number; // cripto por cada boliviano
  wallet_destino: string;
}

export interface WithdrawalRequest {
  toAddress: string;
  cryptoAmount: number;
  cryptoType: string;
  amount: number;
  withdrawalId: string;
}
