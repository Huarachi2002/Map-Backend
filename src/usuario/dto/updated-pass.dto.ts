import { IsString } from "class-validator";


export class UpdatedUserPassDto {

  @IsString()
  contrasena: string;

  
  @IsString()
  newPass: string;
}