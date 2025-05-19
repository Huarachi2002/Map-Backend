import { IsEmail, IsNotEmpty, IsString, IsUUID, MinLength } from "class-validator";

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
  @IsUUID()
  @IsNotEmpty()
  id_entidad: string;
}
