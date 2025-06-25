import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { AuthTokenResult, IAuthResponse, ISignJwt, IUseToken } from '../interface';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/usuario/services';
import { LoginDto } from '../dto';
import { PrismaService } from 'src/prisma/services';
@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ){}
  public async login(loginDto: LoginDto): Promise<IAuthResponse>{
    const findUser = await this.userService.findUserEmail(loginDto.correo);
    if(!findUser)
      throw new NotFoundException("Usuario no encontrado")
      
    // Verificar estado del usuario
    if(!findUser.estado)
      throw new BadRequestException("Usuario desactivado, contacte al administrador");

    const validatePass = bcrypt.compareSync(loginDto.contrasena, findUser.contrasena);
    
    if(!validatePass)
      throw new BadRequestException("Ingrese el password correcto");
      
    let clienteInfo = null;
    let empleadoInfo = null;
    
    // Obtener información adicional según el tipo de usuario
    if(findUser.tipo === 'CLIENTE') {
      clienteInfo = await this.prismaService.cliente.findUnique({
        where: { id: findUser.id },
        include: { 
          usuario: true,
          tarjetas: true
        }
      });
    } else if(findUser.tipo === 'EMPLEADO') {
      empleadoInfo = await this.prismaService.empleado.findUnique({
        where: { id: findUser.id },
        include: { 
          entidad: true,
          micros: true
        }
      });
    }

    return {
      user: findUser,
      cliente: clienteInfo,
      empleado: empleadoInfo,
      token: this.signJwt({
        payload: {
          userId: findUser.id,
        },
        expires: 10 * 24 * 60 * 60 , 
      }) 
    }
  }

  public useToken(token: string): IUseToken | string {
    try {
      const decode = this.jwtService.decode(token) as AuthTokenResult;
      const currentDate = new Date();
      const expiresDate = new Date(decode.exp);

      return {
        userId: decode.userId,
        isExpired: +expiresDate <= +currentDate / 1000,
      };
    } catch (err) {
      return 'token es invalido';
    }
  }

  public async forgotPassword(correo: string): Promise<void> {
    const findUser = await this.userService.findUserEmail(correo);
    if(!findUser)
      throw new NotFoundException(`El ${correo} no se encuantra registrado`);
    
    // Contraseña aleatoria de 8 caracteres
    const newPass = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    
    const resultPassword = await this.userService.updatedPasswordForgot(findUser.id, newPass.toString());
    if(!resultPassword)
      throw new BadRequestException("Error al actualizar la contraseña");
  }

  private signJwt({expires,payload}: ISignJwt): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>("secret_key_jwt"),
      expiresIn: expires,
    })
  }
}
