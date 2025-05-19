import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class EntidadOperadoraUpdateDto {
  @IsString()
  @MinLength(3)
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  direccion?: string;
}
