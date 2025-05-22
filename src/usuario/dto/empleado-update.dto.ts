import { IsEmail, IsNotEmpty, IsOptional, isString, IsString, IsUUID, MinLength } from "class-validator";

export class EmpleadoUpdateDto {
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
  tipo_empleado: string;

}
