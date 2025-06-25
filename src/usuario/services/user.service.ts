import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {  Usuario } from '@prisma/client';
import * as bcrypt from "bcrypt";


import { PrismaService } from 'src/prisma/services';
import { UpdatedUserPassDto, UserCreateDto, UserUpdatedDto } from '../dto';
import { QueryCommonDto } from 'src/common/dto';
import { IOptionUser } from '../interface';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
  ){}



  public async findAllRoom({
      skip,
      limit
    }: QueryCommonDto,
      option?: IOptionUser
  ): Promise<Usuario[]> {
    const findUsers = await this.prismaService.usuario.findMany({
      where: option.where,
      select: option.select,
      skip,
      take:limit
    });
    return findUsers;
  }

  public async countAllRoom(
    option?: IOptionUser
  ): Promise<number> {
    const findAll = await this.prismaService.usuario.count({
      where: option.where
    })
    return findAll;
  }

  public async findAll({
    search,
    skip,
    limit
  }: QueryCommonDto): Promise<Usuario[]> {
    const findAll = await this.prismaService.usuario.findMany({
      where: {
        nombre: {
          contains: search,
          mode: "insensitive"
        }
      },
      skip,
      take: limit
    })
    return findAll;
  }

  public async countAll({
    search  
  }: QueryCommonDto): Promise<number> {
    const findAll = await this.prismaService.usuario.count({
      where: {
        nombre: {
          contains: search,
          mode: "insensitive"
        }
      }
    })
    return findAll;
  }

  public async createUser(usuarioCreateDto: UserCreateDto): Promise<Usuario>{
    const findUser = await this.findUserEmail(usuarioCreateDto.correo);
    if(findUser)
      throw new BadRequestException(`El correo ya se encuentra en uso`);

    let createUser = null;
    if(usuarioCreateDto.tipo === 'CLIENTE'){
      createUser = await this.prismaService.usuario.create({
        data: {
          nombre: usuarioCreateDto.nombre,
          correo: usuarioCreateDto.correo,
          tipo: usuarioCreateDto.tipo,
          contrasena: this.hashPass(usuarioCreateDto.contrasena),
        },
        include:{
          cliente: true,
        }
      })
    }else{
      const existEntidad = await this.prismaService.entidadOperadora.findUnique({
        where:{
          id: usuarioCreateDto.id_entidad
        }
      });

      if(!existEntidad)
        throw new BadRequestException(`La entidad ${usuarioCreateDto.id_entidad} no existe`);

      createUser = await this.prismaService.usuario.create({
        data: {
          nombre: usuarioCreateDto.nombre,
          correo: usuarioCreateDto.correo,
          tipo: usuarioCreateDto.tipo,
          contrasena: this.hashPass(usuarioCreateDto.contrasena),
          empleado: {
            create: {
              id_entidad: usuarioCreateDto.id_entidad,
              tipo: usuarioCreateDto.tipo_empleado,
            }
          }
        },
        include:{
          empleado: true,
        }
      })

    }
    return createUser;
  }

  private hashPass(contrasena: string, saltRounds: number = 10): string{
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(contrasena, salt);
  }

  public async findUser(name: string): Promise<Usuario>{
    const findUser = await this.prismaService.usuario.findFirst({
      where:{
        nombre: {
          contains: name,
          mode: 'insensitive'
        }
      }
    });
    return findUser;
  }


  public async findUserEmail(correo: string): Promise<Usuario> {
    const findUser = await this.prismaService.usuario.findFirst({
      where:{
        correo
      }
    });
    return findUser;
  }

  public async findIdUser(id: string): Promise<Usuario>{
    const findUser = await this.prismaService.usuario.findUnique({
      where:{
        id
      }
    });
    if(!findUser)
      throw new NotFoundException(`El usuario ${id} no encontrado`)
    return findUser;
  }

  public async updatedUser(id:string, usuarioUpdateDto: UserUpdatedDto): Promise<Usuario> {

    const updatedUser = await this.prismaService.usuario.update({
      where:{
        id
      },
      data: {
        correo: usuarioUpdateDto.correo,
        nombre: usuarioUpdateDto.nombre        
      }
    });

    return updatedUser;
  }

  public async updatedPassword(id: string, updPass: UpdatedUserPassDto): Promise<Usuario> {
    const findUser = await this.findIdUser(id);

    const validatePass = bcrypt.compareSync(updPass.contrasena, findUser.contrasena);
    
    if(!validatePass)
      throw new BadRequestException("La contraseña no coinciden");

    const updatedPass = await this.prismaService.usuario.update({
      where: {
        id: findUser.id
      },
      data:{
        contrasena: this.hashPass(updPass.newPass)
      }
    });

    return updatedPass;

  }

  public async updatedPasswordForgot(id: string, contrasena: string): Promise<Usuario> {
    const updatedPass = await this.prismaService.usuario.update({
      where: {
        id
      },
      data:{
        contrasena: this.hashPass(contrasena)
      }
    });
    return updatedPass;
  }
}
