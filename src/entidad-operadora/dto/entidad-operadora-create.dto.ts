import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class EntidadOperadoraCreateDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  nombre: string;
  
  @IsString()
  @IsNotEmpty()
  tipo: string;

  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsNumber()
  @IsNotEmpty()
  latitud: number;

  @IsNumber()
  @IsNotEmpty()
  longitud: number;

  @IsString()
  @IsEmail()
  correo_contacto: string;

  @IsString()
  wallet_address: string;

  @IsString()
  id_divisa: string;
}
