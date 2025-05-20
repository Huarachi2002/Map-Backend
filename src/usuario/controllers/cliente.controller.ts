import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthTokenGuard } from 'src/auth/guard';
import { ClienteService, UserService } from '../services';
import { IApiResponse } from 'src/common/interface';
import { QueryCommonDto } from 'src/common/dto';
import { IResponseCliente } from '../interface';
import { ClienteCreateDto } from '../dto';

@Controller('cliente')
@UseGuards(AuthTokenGuard)
export class ClienteController {  constructor(
    private readonly clienteService: ClienteService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async findAll(
    @Query() queryDto: QueryCommonDto
  ): Promise<IApiResponse<{ clientes: any[], total: number }>> {
    const statusCode = HttpStatus.OK;
    const [clientes, total] = await Promise.all([
      this.clienteService.findAll(queryDto),
      this.clienteService.countAll(queryDto)
    ]);

    return {
      statusCode,
      message: "Clientes encontrados",
      data: {
        clientes,
        total
      }
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async findById(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<IApiResponse<IResponseCliente>> {
    const statusCode = HttpStatus.OK;
    const cliente = await this.clienteService.findById(id);

    return {
      statusCode,
      message: "Cliente encontrado",
      data: {
        cliente
      }
    };
  }

  @Get('wallet/:id_cliente')
  @HttpCode(HttpStatus.OK)
  public async findByWalletAddress(
    @Param('id_cliente') id_cliente: string
  ): Promise<IApiResponse<IResponseCliente>> {
    const statusCode = HttpStatus.OK;
    const cliente = await this.clienteService.findByWalletAddress(id_cliente);

    return {
      statusCode,
      message: "Cliente encontrado",
      data: {
        cliente
      }
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async createCliente(
    @Body() clienteCreateDto: ClienteCreateDto
  ): Promise<IApiResponse<IResponseCliente>> {
    const statusCode = HttpStatus.CREATED;
    
    // Primero creamos el usuario base
    const usuario = await this.userService.createUser({
      nombre: clienteCreateDto.nombre,
      correo: clienteCreateDto.correo,
      contrasena: clienteCreateDto.contrasena,
      tipo: 'CLIENTE'
    });
    
    // Luego creamos el cliente con el ID del usuario
    const cliente = await this.clienteService.create(usuario.id, clienteCreateDto.wallet_address);

    return {
      statusCode,
      message: "Cliente creado exitosamente",
      data: {
        cliente
      }
    };
  }
  
  @Post(':userId/wallet/:wallet_address')
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('wallet_address') wallet_address: string
  ): Promise<IApiResponse<IResponseCliente>> {
    const statusCode = HttpStatus.CREATED;
    const cliente = await this.clienteService.create(userId, wallet_address);

    return {
      statusCode,
      message: "Cliente creado exitosamente",
      data: {
        cliente
      }
    };
  }

  @Put(':id/wallet/:wallet_address')
  @HttpCode(HttpStatus.OK)
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('wallet_address') wallet_address: string
  ): Promise<IApiResponse<IResponseCliente>> {
    const statusCode = HttpStatus.OK;
    const cliente = await this.clienteService.update(id, wallet_address);

    return {
      statusCode,
      message: "Cliente actualizado exitosamente",
      data: {
        cliente
      }
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  public async delete(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<IApiResponse<IResponseCliente>> {
    const statusCode = HttpStatus.OK;
    const cliente = await this.clienteService.delete(id);

    return {
      statusCode,
      message: "Cliente eliminado exitosamente",
      data: {
        cliente
      }
    };
  }
}
