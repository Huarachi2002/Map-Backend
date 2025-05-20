import { IsEmail, IsNotEmpty, isString, IsString, IsUUID, MinLength } from "class-validator";

export class EmpleadoCreateDto {
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
  tipo_empleado: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  id_entidad: string;
}
