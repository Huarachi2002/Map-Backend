import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class ClienteCreateDto {
  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  contrasena: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  correo: string;

  @IsString()
  @IsNotEmpty()
  wallet_address: string;

  @IsString()
  @IsNotEmpty()
  id_divisa: string;
}
