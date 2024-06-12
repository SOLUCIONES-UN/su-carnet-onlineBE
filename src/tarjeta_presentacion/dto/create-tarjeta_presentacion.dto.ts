import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTarjetaPresentacionDto {

    @IsString()
    @IsNotEmpty({ message: 'El campo icono es requerido' })
    logo: string;

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
    @IsNotEmpty({ message: 'El campo idEmpresa es requerido' })
    idEmpresa: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idUsuario es requerido' })
    idUsuario: number;
}
