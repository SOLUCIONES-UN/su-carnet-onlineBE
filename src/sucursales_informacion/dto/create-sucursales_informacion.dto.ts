import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateSucursalesInformacionDto {

    @IsString()
    @IsNotEmpty({ message: 'El campo descripcion es requerido' })
    descripcion: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo direccion es requerido' })
    direccion: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo informacionGeneral es requerido' })
    informacionGeneral: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo archivoImagen1 es requerido' })
    archivoImagen1: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo archivoImagen2 es requerido' })
    archivoImagen2: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo horarioPropio es requerido' })
    horarioPropio: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo tieneProgramacion es requerido' })
    tieneProgramacion: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo minutosProgramacion es requerido' })
    minutosProgramacion: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo cantidadProgramacion es requerido' })
    cantidadProgramacion: number;

    @IsString()
    @IsNotEmpty({ message: 'El campo membreciaImagenFondo es requerido' })
    membreciaImagenFondo: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo membreciaUsaSelfie es requerido' })
    membreciaUsaSelfie: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo tipoSucursal es requerido' })
    tipoSucursal: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idEmpresa es requerido' })
    idEmpresa: number;

}
