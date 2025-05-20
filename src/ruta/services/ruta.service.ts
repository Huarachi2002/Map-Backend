import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Ruta } from '@prisma/client';
import { PrismaService } from 'src/prisma/services';
import { RutaCreateDto } from '../dto/ruta-create.dto';
import { RutaUpdateDto } from '../dto/ruta-update.dto';

@Injectable()
export class RutaService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  public async findByIdEntidad(id_entidad: string): Promise<Ruta[]> {
    const rutas = await this.prismaService.ruta.findMany({
      where: {
        id_entidad
      }
    });
    
    return rutas;
  }

  public async findById(id: string): Promise<Ruta> {
    const rutas = await this.prismaService.ruta.findFirst({
      where: {
        id
      }
    });
    
    return rutas;
  }

  public async create(rutaDto: RutaCreateDto): Promise<Ruta> {
    // Verificar que el nombre no esté en uso
    const existRuta = await this.prismaService.ruta.findFirst({
      where: {
        nombre: {
          equals: rutaDto.nombre,
          mode: 'insensitive'
        }
      }
    });
    
    if (existRuta) {
      throw new BadRequestException(`La ruta con nombre ${rutaDto.nombre} ya existe`);
    }
    
    const ruta = await this.prismaService.ruta.create({
      data: {
        nombre: rutaDto.nombre,
        descripcion: rutaDto.descripcion,
        origenLat: rutaDto.origenLat,
        origenLong: rutaDto.origenLong,
        destinoLat: rutaDto.destinoLat,
        destinoLong: rutaDto.destinoLong,
        vertices: rutaDto.vertices,
        id_entidad: rutaDto.id_entidad
      }
    });
    
    return ruta;
  }

  public async update(id: string, rutaDto: RutaUpdateDto): Promise<Ruta> {
    // Verificar que la ruta existe
    const existRuta = await this.prismaService.ruta.findFirst({
      where: {
        id
      }
    });

    if (!existRuta) {
      throw new NotFoundException(`Ruta con ID ${id} no encontrada`);
    }
    
    // Verificar que el nombre no esté en uso por otra ruta
    if (rutaDto.nombre) {
      const existingRuta = await this.prismaService.ruta.findFirst({
        where: {
          nombre: {
            equals: rutaDto.nombre,
            mode: 'insensitive'
          },
          NOT: {
            id
          }
        }
      });
      
      if (existingRuta) {
        throw new BadRequestException(`La ruta con nombre ${rutaDto.nombre} ya existe`);
      }
    }
    
    const updatedRuta = await this.prismaService.ruta.update({
      where: {
        id
      },
      data: {
        nombre: rutaDto.nombre,
        descripcion: rutaDto.descripcion,
        origenLat: rutaDto.origenLat,
        origenLong: rutaDto.origenLong,
        destinoLat: rutaDto.destinoLat,
        destinoLong: rutaDto.destinoLong,
        vertices: rutaDto.vertices,
      }
    });
    
    return updatedRuta;
  }

  public async delete(id: string): Promise<Ruta> {
    // Verificar que la ruta existe
    const existRuta = await this.prismaService.ruta.findFirst({
      where: {
        id
      }
    });

    if (!existRuta) {
      throw new NotFoundException(`Ruta con ID ${id} no encontrada`);
    }
    
    const deletedRuta = await this.prismaService.ruta.delete({
      where: {
        id
      }
    });
    
    return deletedRuta;
  }
}
