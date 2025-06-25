import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";



export class UserCreateDto {

  @IsString()
  @MinLength(5)
  nombre: string;

  @IsString()
  @MinLength(8)
  contrasena: string;

  @IsString()
  @IsEmail()
  correo: string;

  @IsString()
  tipo: string;

  @IsString()
  @IsOptional()
  wallet_address?: string;

  @IsString()
  @IsOptional()
  id_entidad?: string;

  @IsString()
  @IsOptional()
  tipo_empleado?: string;

}