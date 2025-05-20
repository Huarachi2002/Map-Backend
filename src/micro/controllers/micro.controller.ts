import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { IApiResponse } from 'src/common/interface';
import { MicroService } from '../services/micro.service';
import { MicroCreateDto } from '../dto/micro-create.dto';
import { MicroUpdateDto } from '../dto/micro-update.dto';

@Controller('micro')
export class MicroController {
  constructor(
    private readonly microService: MicroService,
  ) {}

  @Get(':id_entidad')
  @HttpCode(HttpStatus.OK)
  public async findByIdEntidad(
    @Param('id_entidad', ParseUUIDPipe) id_entidad: string
  ): Promise<IApiResponse<any>> {
    const statusCode = HttpStatus.OK;
    const micros = await this.microService.findByIdEntidad(id_entidad);

    return {
      statusCode,
      message: "micros encontradas",
      data: {
        micros
      }
    };
  }

    @Get('/find/:id')
  @HttpCode(HttpStatus.OK)
  public async findById(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<IApiResponse<any>> {
    const statusCode = HttpStatus.OK;
    const micros = await this.microService.findById(id);

    return {
      statusCode,
      message: "micro encontrada",
      data: {
        micros
      }
    };
  }

    @Post(':id_entidad')
    @HttpCode(HttpStatus.CREATED)
    public async create(
        @Body() entidadDto: MicroCreateDto
    ): Promise<IApiResponse<any>> {
        const statusCode = HttpStatus.CREATED;
        const micro = await this.microService.create(entidadDto);

        return {
        statusCode,
        message: "micro creado exitosamente",
        data: {
            micro
        }
        };
    }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() microDto: MicroUpdateDto
  ): Promise<IApiResponse<any>> {
    const statusCode = HttpStatus.OK;
    const micro = await this.microService.update(id, microDto);

    return {
      statusCode,
      message: "Micro actualizado exitosamente",
      data: {
        micro
      }
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  public async delete(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<IApiResponse<any>> {
    const statusCode = HttpStatus.OK;
    const micro = await this.microService.delete(id);

    return {
      statusCode,
      message: "Micro eliminado exitosamente",
      data: {
        micro
      }
    };
  }
}
