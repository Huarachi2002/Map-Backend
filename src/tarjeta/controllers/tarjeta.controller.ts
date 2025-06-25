import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put, UseGuards } from '@nestjs/common';
import { AuthTokenGuard } from 'src/auth/guard';
import { TarjetaService } from '../services/tarjeta.service';
import { IApiResponse } from 'src/common/interface';
import { PagoPasajeDto, RecargaTarjetaDto } from '../interface/tarjeta.interface';

@Controller('tarjeta')
@UseGuards(AuthTokenGuard)
export class TarjetaController {
    constructor(private readonly tarjetaService: TarjetaService) {}

    @Post('recargar')
    @HttpCode(HttpStatus.OK)
    async recargarTarjeta(
        @Body() recargaDto: RecargaTarjetaDto
    ): Promise<IApiResponse<any>> {
        const statusCode = HttpStatus.OK;
        const resultado = await this.tarjetaService.recargaTarjeta(recargaDto);

        return {
            statusCode,
            message: "Tarjeta recargada exitosamente",
            data: resultado
        };
    }

    // Procesa un pago con una tarjeta a un micro
    @Post('pago')
    @HttpCode(HttpStatus.OK)
    async procesarPago(
        @Body() pagoDto: PagoPasajeDto
    ): Promise<IApiResponse<any>> {
        const statusCode = HttpStatus.OK;
        const resultado = await this.tarjetaService.procesarPago(pagoDto);

        return {
            statusCode,
            message: "Pago procesado exitosamente",
            data: resultado
        };
    }

    // Crea una nueva tarjeta para un cliente
    @Post('crear')
    @HttpCode(HttpStatus.CREATED)
    async crearTarjeta(
        @Body() createDto: { id_cliente: string; tipo_tarjeta: string }
    ): Promise<IApiResponse<any>> {
        const statusCode = HttpStatus.CREATED;
        const tarjeta = await this.tarjetaService.crearTarjeta(
            createDto.id_cliente, 
            createDto.tipo_tarjeta
        );

        return {
            statusCode,
            message: "Tarjeta creada exitosamente",
            data: { tarjeta }
        };
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async obtenerTarjetaPorId(
        @Param('id', ParseUUIDPipe) id: string
    ): Promise<IApiResponse<any>> {
        const statusCode = HttpStatus.OK;
        const tarjeta = await this.tarjetaService.obtenerTarjetaPorId(id);

        return {
            statusCode,
            message: "Tarjeta obtenida exitosamente",
            data: tarjeta
        };
    }

    // Obtiene las tarjetas de un cliente específico
    @Get('cliente-tarjeta/:id_cliente')
    @HttpCode(HttpStatus.OK)
    async obtenerTarjetasCliente(
        @Param('id_cliente', ParseUUIDPipe) id_cliente: string
    ): Promise<IApiResponse<any[]>> {
        const statusCode = HttpStatus.OK;
        const tarjetas = await this.tarjetaService.obtenerTarjetasCliente(id_cliente);

        return {
            statusCode,
            message: "Tarjetas obtenidas exitosamente",
            data: tarjetas
        };
    }

    @Get(':id_tarjeta/movimientos')
    @HttpCode(HttpStatus.OK)
    async obtenerHistorial(
        @Param('id_tarjeta', ParseUUIDPipe) id_tarjeta: string
    ): Promise<IApiResponse<any[]>> {
        const statusCode = HttpStatus.OK;
        const movimientos = await this.tarjetaService.obtenerHistorialMovimientos(id_tarjeta);

        return {
            statusCode,
            message: "Historial obtenido exitosamente",
            data: movimientos
        };
    }

    @Get(':id_tarjeta/pagos')
    @HttpCode(HttpStatus.OK)
    async obtenerHistorialPagos(
        @Param('id_tarjeta', ParseUUIDPipe) id_tarjeta: string
    ): Promise<IApiResponse<any[]>> {
        const statusCode = HttpStatus.OK;
        const pagos = await this.tarjetaService.obtenerHistorialPagos(id_tarjeta);

        return {
            statusCode,
            message: "Historial de pagos obtenido exitosamente",
            data: pagos
        };
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async actualizarTarjeta(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateDto: { saldo: number }
    ): Promise<IApiResponse<any>> {
        const statusCode = HttpStatus.OK;
        const tarjeta = await this.tarjetaService.actualizarTarjeta(id, updateDto);

        return {
            statusCode,
            message: "Tarjeta actualizada exitosamente",
            data: tarjeta
        };
    }
}