import { IsEmail, IsOptional, IsString } from "class-validator";


export class UserUpdatedDto {

  @IsString()
  nombre: string;

  @IsString()
  @IsEmail()
  correo: string;

}