import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Cliente, Usuario } from '@prisma/client';
import { PrismaService } from 'src/prisma/services';
import { QueryCommonDto } from 'src/common/dto';
import { UserService } from './user.service';
import { ClienteUpdateDto } from '../dto/cliente-update.dto';

@Injectable()
export class ClienteService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  public async findAll({
    search,
    skip,
    limit
  }: QueryCommonDto): Promise<(Cliente & { usuario: any })[]> {
    const findAll = await this.prismaService.cliente.findMany({
      where: {
        usuario: {
          nombre: {
            contains: search,
            mode: "insensitive"
          }
        }
      },
      include: {
        usuario: true
      },
      skip,
      take: limit
    });
    return findAll;
  }

  public async countAll({
    search
  }: QueryCommonDto): Promise<number> {
    const count = await this.prismaService.cliente.count({
      where: {
        usuario: {
          nombre: {
            contains: search,
            mode: "insensitive"
          }
        }
      }
    });
    return count;
  }
  public async findById(id: string): Promise<Cliente & { usuario: any; tarjetas?: any[] }> {
    const cliente = await this.prismaService.cliente.findUnique({
      where: {
        id
      },
      include: {
        usuario: true,
        tarjetas: true
      }
    });
    
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    
    return cliente;
  }
  public async findByWalletAddress(id: string): Promise<Cliente & { usuario: any }> {
    const cliente = await this.prismaService.cliente.findUnique({
      where: {
        id
      },
      include: {
        usuario: true
      }
    });
    
    if (!cliente) {
      throw new NotFoundException(`Cliente con Id ${id} no encontrado`);
    }
    
    return cliente;
  }

  public async create(userId: string, wallet_address: string): Promise<Cliente & { usuario: any }> {
    // Verificar que el usuario existe
    const usuario = await this.userService.findIdUser(userId);
    
    // Verificar que el wallet_address no esté en uso
    const existingWallet = await this.prismaService.cliente.findUnique({
      where: {
        wallet_address
      }
    });
    
    if (existingWallet) {
      throw new BadRequestException(`La dirección de wallet ${wallet_address} ya está en uso`);
    }
    
    // Crear cliente
    const cliente = await this.prismaService.cliente.create({
      data: {
        id: usuario.id,
        wallet_address
      },
      include: {
        usuario: true
      }
    });
    
    return cliente;
  }

  public async update(id: string, clienteDto: ClienteUpdateDto): Promise<Cliente & { usuario: any }> {
    // Verificar que el cliente existe
    await this.findById(id);
    
    // Actualizar cliente
    const updatedCliente = await this.prismaService.cliente.update({
      where: {
        id
      },
      data: {
        wallet_address: clienteDto.wallet_address,
        usuario: {
          update: {
            nombre: clienteDto.nombre,
            correo: clienteDto.correo,
            contrasena: clienteDto.contrasena
          }
        }
      },
      include: {
        usuario: true
      }
    });
    
    return updatedCliente;
  }

  public async delete(id: string): Promise<Cliente & { usuario: any }> {
    // Verificar que el cliente existe
    await this.findById(id);
    
    // Eliminar cliente (establecer estado en false)
    const deletedCliente = await this.prismaService.$transaction(async (prisma) => {
      // Actualizar estado del usuario
      await prisma.usuario.update({
        where: { id },
        data: { estado: false }
      });
      
      // Obtener el cliente actualizado con usuario
      return prisma.cliente.findUnique({
        where: { id },
        include: { usuario: true }
      });
    });
    
    return deletedCliente;
  }
}