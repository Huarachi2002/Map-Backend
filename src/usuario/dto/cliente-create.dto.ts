import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class ClienteCreateDto {
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
  @IsNotEmpty()
  wallet_address: string;
}
