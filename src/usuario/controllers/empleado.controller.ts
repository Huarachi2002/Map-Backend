import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthTokenGuard } from 'src/auth/guard';
import { EmpleadoService, UserService } from '../services';
import { IApiResponse } from 'src/common/interface';
import { QueryCommonDto } from 'src/common/dto';
import { IResponseEmpleado } from '../interface';
import { EmpleadoCreateDto } from '../dto';

@Controller('empleado')
@UseGuards(AuthTokenGuard)
export class EmpleadoController {  constructor(
    private readonly empleadoService: EmpleadoService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async findAll(
    @Query() queryDto: QueryCommonDto
  ): Promise<IApiResponse<{ empleados: any[], total: number }>> {
    const statusCode = HttpStatus.OK;
    const [empleados, total] = await Promise.all([
      this.empleadoService.findAll(queryDto),
      this.empleadoService.countAll(queryDto)
    ]);

    return {
      statusCode,
      message: "Empleados encontrados",
      data: {
        empleados,
        total
      }
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async findById(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<IApiResponse<IResponseEmpleado>> {
    const statusCode = HttpStatus.OK;
    const empleado = await this.empleadoService.findById(id);

    return {
      statusCode,
      message: "Empleado encontrado",
      data: {
        empleado
      }
    };
  }

  @Get('entidad/:entidadId')
  @HttpCode(HttpStatus.OK)
  public async findByEntidad(
    @Param('entidadId', ParseUUIDPipe) entidadId: string,
    @Query() queryDto: QueryCommonDto
  ): Promise<IApiResponse<{ empleados: any[] }>> {
    const statusCode = HttpStatus.OK;
    const empleados = await this.empleadoService.findByEntidad(entidadId, queryDto);

    return {
      statusCode,
      message: "Empleados encontrados por entidad",
      data: {
        empleados
      }
    };
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async createEmpleado(
    @Body() empleadoCreateDto: EmpleadoCreateDto
  ): Promise<IApiResponse<IResponseEmpleado>> {
    const statusCode = HttpStatus.CREATED;
    
    // Primero creamos el usuario base
    const usuario = await this.userService.createUser({
      nombre: empleadoCreateDto.nombre,
      correo: empleadoCreateDto.correo,
      contrasena: empleadoCreateDto.contrasena,
      tipo: 'empleado'
    });
    
    // Luego creamos el empleado con el ID del usuario
    const empleado = await this.empleadoService.create(usuario.id, empleadoCreateDto.id_entidad);

    return {
      statusCode,
      message: "Empleado creado exitosamente",
      data: {
        empleado
      }
    };
  }
  
  @Post(':userId/entidad/:entidadId')
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('entidadId', ParseUUIDPipe) entidadId: string
  ): Promise<IApiResponse<IResponseEmpleado>> {
    const statusCode = HttpStatus.CREATED;
    const empleado = await this.empleadoService.create(userId, entidadId);

    return {
      statusCode,
      message: "Empleado creado exitosamente",
      data: {
        empleado
      }
    };
  }

  @Put(':id/entidad/:entidadId')
  @HttpCode(HttpStatus.OK)
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('entidadId', ParseUUIDPipe) entidadId: string
  ): Promise<IApiResponse<IResponseEmpleado>> {
    const statusCode = HttpStatus.OK;
    const empleado = await this.empleadoService.update(id, entidadId);

    return {
      statusCode,
      message: "Empleado actualizado exitosamente",
      data: {
        empleado
      }
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  public async delete(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<IApiResponse<IResponseEmpleado>> {
    const statusCode = HttpStatus.OK;
    const empleado = await this.empleadoService.delete(id);

    return {
      statusCode,
      message: "Empleado eliminado exitosamente",
      data: {
        empleado
      }
    };
  }
}
