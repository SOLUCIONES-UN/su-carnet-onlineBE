import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateOutsoursingInformacionDto {

    @IsString()
    @IsNotEmpty({ message: 'El campo fechaSolicitud es requerido' })
    fechaSolicitud: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo fechaInicio es requerido' })
    fechaInicio: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idEmpresaHijo es requerido' })
    idEmpresaHijo: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idEmpresaPadre es requerido' })
    idEmpresaPadre: number;

}
