export interface ExchangeRequest {
  fromAddress: string;
  toAddress: string;
  cryptoAmount: number;
  cryptoType: string;
  bolivianosAmount: number;
  exchangeId: string;
}

export interface WithdrawalRequest {
  toAddress: string;
  cryptoAmount: number;
  cryptoType: string;
  bolivianosAmount: number;
  withdrawalId: string;
}

export interface PaymentRequest {
  tokenAddress: string;
  amount: number;
  paymentId: string;
}

export interface BlockchainResponse {
  success: boolean;
  txHash?: string;
  gasFee?: number;
  error?: string;
}