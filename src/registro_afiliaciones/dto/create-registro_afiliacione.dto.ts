import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRegistroAfiliacioneDto {

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idEmpresa es requerido' })
    idEmpresa: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idUsuario es requerido' })
    idUsuario: number;

    @IsString()
    @IsNotEmpty({ message: 'El campo estado es requerido' })
    estado: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo tipoSolicitud es requerido' })
    tipoSolicitud: number;
}
