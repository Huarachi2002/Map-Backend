import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class EntidadOperadoraUpdateDto {
  @IsString()
  @MinLength(3)
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  tipo: string;

  @IsString()
  @IsOptional()
  direccion: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  correo_contacto: string;

  @IsString()
  @IsOptional()
  wallet_address: string;

  @IsNumber()
  @IsOptional()
  saldo_ingresos: number;

  @IsBoolean()
  @IsOptional()
  estado: boolean;
}
