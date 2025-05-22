import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Parada } from '@prisma/client';
import { PrismaService } from 'src/prisma/services';
import { ParadaCreateDto } from '../dto/parada-create.dto';
import { ParadaUpdateDto } from '../dto/parada-update.dto';

@Injectable()
export class ParadaService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  public async findByIdRuta(id_ruta: string): Promise<Parada[]> {
    const paradas = await this.prismaService.parada.findMany({
      where: {
        id_ruta
      }
    });
    
    return paradas;
  }

  public async findById(id: string): Promise<Parada> {
    const parada = await this.prismaService.parada.findFirst({
      where: {
        id
      }
    });
    
    return parada;
  }

  public async create(paradaDto: ParadaCreateDto): Promise<Parada> {
    // Verificar que el nombre no esté en uso
    const existParada = await this.prismaService.parada.findFirst({
      where: {
        nombre: {
          equals: paradaDto.nombre,
          mode: 'insensitive'
        }
      }
    });
    
    if (existParada) {
      throw new BadRequestException(`La parada con nombre ${paradaDto.nombre} ya existe`);
    }
    
    const parada = await this.prismaService.parada.create({
      data: {
        nombre: paradaDto.nombre,
        latitud: paradaDto.latitud,
        longitud: paradaDto.longitud,
        tiempo: paradaDto.tiempo,
        id_ruta: paradaDto.id_ruta,
      }
    });
    
    return parada;
  }

  public async update(id: string, paradaDto: ParadaUpdateDto): Promise<Parada> {
    // Verificar que la parada existe
    const existRuta = await this.prismaService.parada.findFirst({
      where: {
        id
      }
    });

    if (!existRuta) {
      throw new NotFoundException(`Parada con ID ${id} no encontrada`);
    }
    
    // Verificar que el nombre no esté en uso por otra parada
    if (paradaDto.nombre) {
      const existingRuta = await this.prismaService.parada.findFirst({
        where: {
          nombre: {
            equals: paradaDto.nombre,
            mode: 'insensitive'
          },
          NOT: {
            id
          }
        }
      });
      
      if (existingRuta) {
        throw new BadRequestException(`La parada con nombre ${paradaDto.nombre} ya existe`);
      }
    }
    
    const updatedRuta = await this.prismaService.parada.update({
      where: {
        id
      },
      data: {
        nombre: paradaDto.nombre,
        latitud: paradaDto.latitud,
        longitud: paradaDto.longitud,
        tiempo: paradaDto.tiempo,
      }
    });
    
    return updatedRuta;
  }

  public async delete(id: string): Promise<Parada> {
    // Verificar que la parada existe
    const existParada = await this.prismaService.parada.findFirst({
      where: {
        id
      }
    });

    if (!existParada) {
      throw new NotFoundException(`Parada con ID ${id} no encontrada`);
    }
    
    const deletedParada = await this.prismaService.parada.delete({
      where: {
        id
      }
    });
    
    return deletedParada;
  }
}
