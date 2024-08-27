import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTarjetaPresentacionDto {

    @IsString()
    @IsOptional()
    imgFondo: string;

    @IsString()
    @IsOptional()
    linkedin: string;

    @IsString()
    @IsOptional()
    facebook: string;

    @IsString()
    @IsOptional()
    instagram: string;

    @IsString()
    @IsOptional()
    telefonoOficina: string;

    @IsString()
    @IsOptional()
    telefonoMovil: string;

    @IsString()
    @IsOptional()
    correo: string;

    @IsString()
    @IsOptional()
    puesto: string;

    @IsString()
    @IsOptional()
    direccion: string;

    @IsNumber()
    @IsOptional()
    idEmpresa: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idUsuario es requerido' })
    idUsuario: number;
}
