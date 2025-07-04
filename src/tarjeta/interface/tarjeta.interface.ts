export interface RecargaTarjetaDto {
    id_tarjeta: string;
    monto_cripto: number;
    tipo_cripto: string;
    tasa_conversion: number; // bolivianos por cada unidad de cripto
}

export interface ExchangeRequest {
    fromAddress: string;
    toAddress: string;
    cryptoAmount: number;
    cryptoType: string;
    amount: number;
    exchangeId: string;
}

export interface PagoPasajeDto {
    id_tarjeta: string;
    monto: number;
    id_micro: string;
}