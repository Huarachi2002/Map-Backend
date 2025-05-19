import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EntidadOperadora } from '@prisma/client';
import { PrismaService } from 'src/prisma/services';
import { QueryCommonDto } from 'src/common/dto';
import { EntidadOperadoraCreateDto, EntidadOperadoraUpdateDto } from '../dto';

@Injectable()
export class EntidadOperadoraService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  public async findAll({
    search,
    skip,
    limit
  }: QueryCommonDto): Promise<EntidadOperadora[]> {
    const entidades = await this.prismaService.entidadOperadora.findMany({
      where: {
        nombre: {
          contains: search,
          mode: "insensitive"
        }
      },
      skip,
      take: limit
    });
    return entidades;
  }

  public async countAll({
    search
  }: QueryCommonDto): Promise<number> {
    const count = await this.prismaService.entidadOperadora.count({
      where: {
        nombre: {
          contains: search,
          mode: "insensitive"
        }
      }
    });
    return count;
  }

  public async findById(id: string): Promise<EntidadOperadora> {
    const entidad = await this.prismaService.entidadOperadora.findUnique({
      where: {
        id
      },
      include: {
        empleados: {
          include: {
            usuario: true
          }
        }
      }
    });
    
    if (!entidad) {
      throw new NotFoundException(`Entidad Operadora con ID ${id} no encontrada`);
    }
    
    return entidad;
  }

  public async create(entidadDto: EntidadOperadoraCreateDto): Promise<EntidadOperadora> {
    // Verificar que el nombre no esté en uso
    const existingEntidad = await this.prismaService.entidadOperadora.findFirst({
      where: {
        nombre: {
          equals: entidadDto.nombre,
          mode: 'insensitive'
        }
      }
    });
    
    if (existingEntidad) {
      throw new BadRequestException(`La entidad con nombre ${entidadDto.nombre} ya existe`);
    }
    
    const entidad = await this.prismaService.entidadOperadora.create({
      data: {
        nombre: entidadDto.nombre,
        tipo: entidadDto.tipo,
        correo_contacto: entidadDto.correo_contacto,
        wallet_address: entidadDto.wallet_address,
        direccion: entidadDto.direccion
      }
    });
    
    return entidad;
  }

  public async update(id: string, entidadDto: EntidadOperadoraUpdateDto): Promise<EntidadOperadora> {
    // Verificar que la entidad existe
    await this.findById(id);
    
    // Verificar que el nombre no esté en uso por otra entidad
    if (entidadDto.nombre) {
      const existingEntidad = await this.prismaService.entidadOperadora.findFirst({
        where: {
          nombre: {
            equals: entidadDto.nombre,
            mode: 'insensitive'
          },
          NOT: {
            id
          }
        }
      });
      
      if (existingEntidad) {
        throw new BadRequestException(`La entidad con nombre ${entidadDto.nombre} ya existe`);
      }
    }
    
    const updatedEntidad = await this.prismaService.entidadOperadora.update({
      where: {
        id
      },
      data: {
        nombre: entidadDto.nombre,
        direccion: entidadDto.direccion
      }
    });
    
    return updatedEntidad;
  }

  public async delete(id: string): Promise<EntidadOperadora> {
    // Verificar que la entidad existe
    await this.findById(id);
    
    // Verificar si tiene empleados activos
    const empleadosActivos = await this.prismaService.empleado.count({
      where: {
        id_entidad: id,
        usuario: {
          estado: true
        }
      }
    });
    
    if (empleadosActivos > 0) {
      throw new BadRequestException(`No se puede eliminar la entidad porque tiene ${empleadosActivos} empleados activos`);
    }
    
    const deletedEntidad = await this.prismaService.entidadOperadora.delete({
      where: {
        id
      }
    });
    
    return deletedEntidad;
  }
}
