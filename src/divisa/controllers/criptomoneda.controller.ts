import { Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Query } from "@nestjs/common";
import { CriptoMonedas } from "@prisma/client";
import { QueryCommonDto } from "src/common/dto/query-common.dto";
import { IApiResponse } from "src/common/interface";
import { CriptoMonedaService } from "../services/criptomoneda.service";

@Controller('criptomoneda')
export class CriptomonedaController {

    constructor(
        private readonly criptomonedaService: CriptoMonedaService,
    ) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    public async findAll(
        @Query() queryDto: QueryCommonDto
    ): Promise<IApiResponse<{criptomonedas: CriptoMonedas[]}>>{
        const criptomonedas = await this.criptomonedaService.findAll(queryDto);
        return {
            statusCode: HttpStatus.OK,
            message: 'Criptomonedas encontradas',
            data: { criptomonedas },
        };
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public async findById(
        @Param('id', ParseUUIDPipe) id: string
    ): Promise<IApiResponse<{criptomoneda: CriptoMonedas}>> {
        const criptomoneda = await this.criptomonedaService.findById(id);
        return {
            statusCode: HttpStatus.OK,
            message: 'Criptomoneda encontrada',
            data: { criptomoneda },
        };
    }
}