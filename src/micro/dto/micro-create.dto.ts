import { IsBoolean, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class MicroCreateDto {
    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    placa: string;

    @IsBoolean()
    @IsNotEmpty()
    estado: boolean;

    @IsString()
    @IsNotEmpty()
    id_entidad: string;

    @IsString()
    @IsNotEmpty()
    color: string;

    @IsString()
    @IsOptional()
    id_ruta?: string;   

    @IsString()
    @IsOptional()
    id_empleado?: string;
}
