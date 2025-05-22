import { IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class ParadaCreateDto {
    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    nombre: string;

    @IsNumber()
    @IsNotEmpty()
    latitud: number;

    @IsNumber()
    @IsNotEmpty()
    longitud: number;

    @IsNumber()
    @IsNotEmpty()
    tiempo: number;

    @IsString()
    @IsNotEmpty()
    id_ruta: string;

}
