import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class EntidadOperadoraCreateDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsString()
  @IsNotEmpty()
  tipo: string;

  @IsString()
  @IsEmail()
  correo_contacto: string;

    @IsString()
    wallet_address: string;
}
