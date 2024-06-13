import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTarjetaPresentacionDto {

    @IsString()
    @IsNotEmpty({ message: 'El campo imgFondo es requerido' })
    imgFondo: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo linkedin es requerido' })
    linkedin: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo facebook es requerido' })
    facebook: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo instagram es requerido' })
    instagram: string;

    @IsNumber()
    @IsNumber()
    @IsOptional()
    idEmpresa: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idUsuario es requerido' })
    idUsuario: number;
}
