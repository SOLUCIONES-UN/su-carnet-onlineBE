import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateOutsoursingInformacionDto {

    @IsString()
    @IsNotEmpty({ message: 'El campo nombreProyecto es requerido' })
    nombreProyecto: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo descripcionProyecto es requerido' })
    descripcionProyecto: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo fechaSolicitud es requerido' })
    fechaSolicitud: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo fechaInicio es requerido' })
    fechaInicio: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo fechaFinalizacion es requerido' })
    fechaFinalizacion: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idEmpresa es requerido' })
    idEmpresa: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idEmpresaRelacionada es requerido' })
    idEmpresaRelacionada: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idTipoRelacion es requerido' })
    idTipoRelacion: number;

}
