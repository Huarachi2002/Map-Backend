import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class RutaUpdateDto {
    @IsString()
    @MinLength(3)
    @IsOptional()
    nombre: string;

    @IsString()
    @IsOptional()
    descripcion: string;

    @IsString()
    @IsOptional()
    origenLat: string;

    @IsString()
    @IsOptional()
    origenLong: string;

    @IsString()
    @IsOptional()
    destinoLat: string;

    @IsString()
    @IsOptional()
    destinoLong: string;

    @IsString()
    @IsOptional()
    vertices: string;

}
