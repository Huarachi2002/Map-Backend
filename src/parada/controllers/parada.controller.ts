import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { QueryCommonDto } from 'src/common/dto';
import { IApiResponse } from 'src/common/interface';
import { ParadaService } from '../services/parada.service';
import { ParadaCreateDto } from '../dto/parada-create.dto';
import { ParadaUpdateDto } from '../dto/parada-update.dto';

@Controller('parada')
export class ParadaController {
  constructor(
    private readonly paradaService: ParadaService,
  ) {}

  @Get(':id_ruta')
  @HttpCode(HttpStatus.OK)
  public async findByIdRuta(
    @Param('id_ruta', ParseUUIDPipe) id_ruta: string
  ): Promise<IApiResponse<any>> {
    const statusCode = HttpStatus.OK;
    const paradas = await this.paradaService.findByIdRuta(id_ruta);

    return {
      statusCode,
      message: "Paradas encontradas",
      data: {
        paradas
      }
    };
  }

  @Get('/find/:id')
  @HttpCode(HttpStatus.OK)
  public async findById(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<IApiResponse<any>> {
    const statusCode = HttpStatus.OK;
    const paradas = await this.paradaService.findById(id);

    return {
      statusCode,
      message: "Parada encontrada",
      data: {
        paradas
      }
    };
  }

    @Post(':id_ruta')
    @HttpCode(HttpStatus.CREATED)
    public async create(
        @Body() paradaDto: ParadaCreateDto,
    ): Promise<IApiResponse<any>> {
        const statusCode = HttpStatus.CREATED;
        const parada = await this.paradaService.create(paradaDto);

        return {
        statusCode,
        message: "Parada creada exitosamente",
        data: {
            parada
        }
        };
    }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() paradaDto: ParadaUpdateDto
  ): Promise<IApiResponse<any>> {
    const statusCode = HttpStatus.OK;
    const parada = await this.paradaService.update(id, paradaDto);

    return {
      statusCode,
      message: "Parada actualizada exitosamente",
      data: {
        parada
      }
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  public async delete(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<IApiResponse<any>> {
    const statusCode = HttpStatus.OK;
    const ruta = await this.paradaService.delete(id);

    return {
      statusCode,
      message: "Ruta eliminada exitosamente",
      data: {
        ruta
      }
    };
  }
}
