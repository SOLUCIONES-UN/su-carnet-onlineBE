import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSucursalesAreasLogDto {

    @IsNumber()
    @IsOptional()
    idPuerta: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idSucursalAreaPermiso es requerido' })
    idSucursalAreaPermiso: number;

    @IsNumber()
    @IsOptional()
    idUsuario: number;

    @IsString()
    @IsOptional()
    estado: string;
}
