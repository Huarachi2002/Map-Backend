import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { EntidadOperadoraService } from '../services';
import { QueryCommonDto } from 'src/common/dto';
import { IApiResponse } from 'src/common/interface';
import { AuthTokenGuard } from 'src/auth/guard';
import { EntidadOperadoraCreateDto, EntidadOperadoraUpdateDto } from '../dto';
import { IResponseEntidadOperadora } from '../interface';

@Controller('entidad-operadora')
@UseGuards(AuthTokenGuard)
export class EntidadOperadoraController {
  constructor(
    private readonly entidadOperadoraService: EntidadOperadoraService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async findAll(
    @Query() queryDto: QueryCommonDto
  ): Promise<IApiResponse<{ entidades: any[], total: number }>> {
    const statusCode = HttpStatus.OK;
    const [entidades, total] = await Promise.all([
      this.entidadOperadoraService.findAll(queryDto),
      this.entidadOperadoraService.countAll(queryDto)
    ]);

    return {
      statusCode,
      message: "Entidades operadoras encontradas",
      data: {
        entidades,
        total
      }
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async findById(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<IApiResponse<IResponseEntidadOperadora>> {
    const statusCode = HttpStatus.OK;
    const entidad = await this.entidadOperadoraService.findById(id);

    return {
      statusCode,
      message: "Entidad operadora encontrada",
      data: {
        entidad
      }
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Body() entidadDto: EntidadOperadoraCreateDto
  ): Promise<IApiResponse<IResponseEntidadOperadora>> {
    const statusCode = HttpStatus.CREATED;
    const entidad = await this.entidadOperadoraService.create(entidadDto);

    return {
      statusCode,
      message: "Entidad operadora creada exitosamente",
      data: {
        entidad
      }
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() entidadDto: EntidadOperadoraUpdateDto
  ): Promise<IApiResponse<IResponseEntidadOperadora>> {
    const statusCode = HttpStatus.OK;
    const entidad = await this.entidadOperadoraService.update(id, entidadDto);

    return {
      statusCode,
      message: "Entidad operadora actualizada exitosamente",
      data: {
        entidad
      }
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  public async delete(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<IApiResponse<IResponseEntidadOperadora>> {
    const statusCode = HttpStatus.OK;
    const entidad = await this.entidadOperadoraService.delete(id);

    return {
      statusCode,
      message: "Entidad operadora eliminada exitosamente",
      data: {
        entidad
      }
    };
  }
}
