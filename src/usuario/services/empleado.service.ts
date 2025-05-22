import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Empleado } from '@prisma/client';
import { PrismaService } from 'src/prisma/services';
import { QueryCommonDto } from 'src/common/dto';
import { UserService } from './user.service';
import { EmpleadoUpdateDto } from '../dto/empleado-update.dto';

@Injectable()
export class EmpleadoService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  public async findAll({
    search,
    skip,
    limit
  }: QueryCommonDto): Promise<(Empleado & { usuario: any; entidad: any })[]> {
    const findAll = await this.prismaService.empleado.findMany({
      where: {
        usuario: {
          nombre: {
            contains: search,
            mode: "insensitive"
          }
        }
      },
      include: {
        usuario: true,
        entidad: true
      },
      skip,
      take: limit
    });
    return findAll;
  }

  public async countAll({
    search
  }: QueryCommonDto): Promise<number> {
    const count = await this.prismaService.empleado.count({
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
  public async findById(id: string): Promise<Empleado & { usuario: any; entidad: any; micros?: any[] }> {
    const empleado = await this.prismaService.empleado.findUnique({
      where: {
        id
      },
      include: {
        usuario: true,
        entidad: true,
      }
    });
    
    if (!empleado) {
      throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
    }
    
    return empleado;
  }
  public async findByEntidad(id_entidad: string, {
    skip,
    limit
  }: QueryCommonDto): Promise<(Empleado & { usuario: any })[]> {
    const empleados = await this.prismaService.empleado.findMany({
      where: {
        id_entidad
      },
      include: {
        usuario: true
      },
      skip,
      take: limit
    });
    
    return empleados;
  }

  public async create(userId: string, id_entidad: string, tipo_empleado: string): Promise<Empleado & { usuario: any; entidad: any }> {
    // Verificar que el usuario existe
    const usuario = await this.userService.findIdUser(userId);
    
    // Verificar que la entidad existe
    const entidad = await this.prismaService.entidadOperadora.findUnique({
      where: {
        id: id_entidad
      }
    });
    
    if (!entidad) {
      throw new BadRequestException(`La entidad con ID ${id_entidad} no existe`);
    }
    
    // Crear empleado
    const empleado = await this.prismaService.empleado.create({
      data: {
        id: usuario.id,
        id_entidad,
        tipo: tipo_empleado
      },
      include: {
        usuario: true,
        entidad: true
      }
    });
    
    return empleado;
  }

  public async update(id: string, empleadoDto: EmpleadoUpdateDto): Promise<Empleado & { usuario: any; entidad: any }> {
    // Verificar que el empleado existe
    await this.findById(id);
    
    // Actualizar empleado
    const updatedEmpleado = await this.prismaService.empleado.update({
      where: {
        id
      },
      data: {
        tipo: empleadoDto.tipo_empleado,
        usuario: {
          update:{
            nombre: empleadoDto.nombre,
            correo: empleadoDto.correo,
            contrasena: empleadoDto.contrasena,
          }
        }
      },
      include: {
        usuario: true,
        entidad: true
      }
    });
    
    return updatedEmpleado;
  }

  public async delete(id: string): Promise<Empleado & { usuario: any; entidad: any }> {
    // Verificar que el empleado existe
    await this.findById(id);
    
    // Eliminar empleado (establecer estado en false)
    const deletedEmpleado = await this.prismaService.$transaction(async (prisma) => {
      // Actualizar estado del usuario
      await prisma.usuario.update({
        where: { id },
        data: { estado: false }
      });
      
      // Obtener el empleado actualizado con usuario
      return prisma.empleado.findUnique({
        where: { id },
        include: { usuario: true, entidad: true }
      });
    });
    
    return deletedEmpleado;
  }
}
