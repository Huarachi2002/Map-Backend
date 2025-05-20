import { IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class RutaCreateDto {
    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @IsString()
    origenLat: string;

    @IsString()
    origenLong: string;

    @IsString()
    destinoLat: string;

    @IsString()
    destinoLong: string;

    @IsString()
    vertices: string;

    @IsString()
    id_entidad: string;

    @IsNumber()
    distancia: number;

    @IsNumber()
    tiempo: number;
}
