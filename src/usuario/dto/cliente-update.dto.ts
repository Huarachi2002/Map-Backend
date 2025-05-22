import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class ClienteUpdateDto {
  @IsString()
  @MinLength(5)
  @IsOptional()
  nombre: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  contrasena: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  correo: string;

  @IsString()
  @IsOptional()
  wallet_address: string;
}
