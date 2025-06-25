import { Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Query } from "@nestjs/common";
import { Divisa } from "@prisma/client";
import { QueryCommonDto } from "src/common/dto/query-common.dto";
import { IApiResponse } from "src/common/interface";
import { DivisaService } from "../services/divisa.service";

@Controller('divisa')
export class DivisaController {

    constructor(
        private readonly divisaService: DivisaService,
    ) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    public async findAll(
        @Query() queryDto: QueryCommonDto
    ): Promise<IApiResponse<{divisas: Divisa[]}>>{
        const divisas = await this.divisaService.findAll(queryDto);
        return {
            statusCode: HttpStatus.OK,
            message: 'Divisas encontradas',
            data: { divisas },
        };
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public async findById(
        @Param('id', ParseUUIDPipe) id: string
    ): Promise<IApiResponse<{divisa: Divisa}>> {
        const divisa = await this.divisaService.findById(id);
        return {
            statusCode: HttpStatus.OK,
            message: 'Divisa encontrada',
            data: { divisa },
        };
    }
}