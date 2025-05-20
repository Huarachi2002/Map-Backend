import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Micro } from '@prisma/client';
import { PrismaService } from 'src/prisma/services';
import { MicroCreateDto } from '../dto/micro-create.dto';
import { MicroUpdateDto } from '../dto/micro-update.dto';

@Injectable()
export class MicroService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  public async findByIdEntidad(id_entidad: string): Promise<Micro[]> {
    const micros = await this.prismaService.micro.findMany({
      where: {
        id_entidad
      }
    });
    
    return micros;
  }

  public async findById(id: string): Promise<Micro> {
    const micro = await this.prismaService.micro.findFirst({
      where: {
        id
      }
    });
    
    return micro;
  }

  public async create(microDto: MicroCreateDto): Promise<Micro> {
    // Verificar que el nombre no esté en uso
    const existMicro = await this.prismaService.micro.findFirst({
      where: {
        placa: {
          equals: microDto.placa,
          mode: 'insensitive'
        }
      }
    });
    
    if (existMicro) {
      throw new BadRequestException(`La Micro con placa ${microDto.placa} ya existe`);
    }
    
    const micro = await this.prismaService.micro.create({
      data: {
        placa: microDto.placa,
        estado: microDto.estado,
        color: microDto.color,
        id_entidad: microDto.id_entidad,
        id_ruta: microDto.id_ruta ?? null,
        id_empleado: microDto.id_empleado ?? null,
      }
    });
    
    return micro;
  }

  public async update(id: string, microDto: MicroUpdateDto): Promise<Micro> {
    // Verificar que la Micro existe
    const existMicro = await this.prismaService.micro.findFirst({
      where: {
        id
      }
    });

    if (!existMicro) {
      throw new NotFoundException(`Micro con ID ${id} no encontrada`);
    }
    
    // Verificar que el nombre no esté en uso por otra Micro
    if (microDto.placa) {
      const existingMicro = await this.prismaService.micro.findFirst({
        where: {
          placa: {
            equals: microDto.placa,
            mode: 'insensitive'
          },
          NOT: {
            id
          }
        }
      });
      
      if (existingMicro) {
        throw new BadRequestException(`La Micro con placa ${microDto.placa} ya existe`);
      }
    }
    
    const updatedMicro = await this.prismaService.micro.update({
      where: {
        id
      },
      data: {
        placa: microDto.placa,
        estado: microDto.estado,
        color: microDto.color,
        id_ruta: microDto.id_ruta ?? null,
        id_empleado: microDto.id_empleado ?? null,
      }
    });
    
    return updatedMicro;
  }

  public async delete(id: string): Promise<Micro> {
    // Verificar que la Micro existe
    const existMicro = await this.prismaService.micro.findFirst({
      where: {
        id
      }
    });

    if (!existMicro) {
      throw new NotFoundException(`Micro con ID ${id} no encontrada`);
    }
    
    const deletedMicro = await this.prismaService.micro.delete({
      where: {
        id
      }
    });
    
    return deletedMicro;
  }
}
