import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { IsNull } from "typeorm";

export class CreateRegistroAfiliacioneDto {

    @IsString()
    @IsNotEmpty({ message: 'El campo fechaSolicitud es requerido' })
    fechaSolicitud: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo fechaInicio es requerido' })
    fechaInicio: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idEmpresa es requerido' })
    idEmpresa: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idUsuario es requerido' })
    idUsuario: number;
}
