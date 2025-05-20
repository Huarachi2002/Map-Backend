import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { QueryCommonDto } from 'src/common/dto';
import { IApiResponse } from 'src/common/interface';
import { RutaService } from '../services/ruta.service';
import { RutaCreateDto } from '../dto/ruta-create.dto';
import { RutaUpdateDto } from '../dto/ruta-update.dto';

@Controller('ruta')
export class RutaController {
  constructor(
    private readonly rutaService: RutaService,
  ) {}

  @Get(':id_entidad')
  @HttpCode(HttpStatus.OK)
  public async findByIdEntidad(
    @Param('id_entidad', ParseUUIDPipe) id_entidad: string
  ): Promise<IApiResponse<any>> {
    const statusCode = HttpStatus.OK;
    const rutas = await this.rutaService.findByIdEntidad(id_entidad);

    return {
      statusCode,
      message: "Rutas encontradas",
      data: {
        rutas
      }
    };
  }

  @Get('/find/:id')
  @HttpCode(HttpStatus.OK)
  public async findById(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<IApiResponse<any>> {
    const statusCode = HttpStatus.OK;
    const rutas = await this.rutaService.findById(id);

    return {
      statusCode,
      message: "Ruta encontrada",
      data: {
        rutas
      }
    };
  }

    @Post(':id_entidad')
    @HttpCode(HttpStatus.CREATED)
    public async create(
        @Body() entidadDto: RutaCreateDto
    ): Promise<IApiResponse<any>> {
        const statusCode = HttpStatus.CREATED;
        const ruta = await this.rutaService.create(entidadDto);

        return {
        statusCode,
        message: "Ruta creada exitosamente",
        data: {
            ruta
        }
        };
    }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() rutaDto: RutaUpdateDto
  ): Promise<IApiResponse<any>> {
    const statusCode = HttpStatus.OK;
    const ruta = await this.rutaService.update(id, rutaDto);

    return {
      statusCode,
      message: "Ruta actualizada exitosamente",
      data: {
        ruta
      }
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  public async delete(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<IApiResponse<any>> {
    const statusCode = HttpStatus.OK;
    const ruta = await this.rutaService.delete(id);

    return {
      statusCode,
      message: "Ruta eliminada exitosamente",
      data: {
        ruta
      }
    };
  }
}
