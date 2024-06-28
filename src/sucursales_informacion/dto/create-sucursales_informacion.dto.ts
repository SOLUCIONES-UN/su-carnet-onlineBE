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

    @IsNumber()
    @IsNotEmpty({ message: 'El campo tipoSucursal es requerido' })
    tipoSucursal: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idEmpresa es requerido' })
    idEmpresa: number;

}
