import { IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class ParadaUpdateDto {
    @IsString()
    @MinLength(3)
    @IsOptional()
    nombre: string;

    @IsNumber()
    @IsOptional()
    latitud: number;

    @IsNumber()
    @IsOptional()
    longitud: number;

    @IsNumber()
    @IsOptional()
    tiempo: number;

}
