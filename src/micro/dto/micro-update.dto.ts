import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

export class MicroUpdateDto {
    @IsString()
    @MinLength(3)
    @IsOptional()
    placa?: string;

    @IsBoolean()
    @IsOptional()
    estado?: boolean;

    @IsString()
    @IsOptional()
    color?: string;

    @IsString()
    @IsOptional()
    id_ruta?: string;  

}
