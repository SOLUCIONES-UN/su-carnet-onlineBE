import { IsArray, IsNotEmpty, IsNumber, IsString, isNumber } from "class-validator";

export class CreateSucursalesAreasInformacionDto {

    @IsString()
    @IsNotEmpty({ message: 'El campo descripcion es requerido' })
    descripcion: string;

    @IsArray()
    @IsNotEmpty({ message: 'El campo informacion es requerido' })
    informacion: string[];

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
    @IsNotEmpty({ message: 'El campo outsoursing es requerido' })
    outsoursing: string;

    @IsArray()
    @IsNotEmpty({ message: 'El campo instruccionesQr es requerido' })
    instruccionesQr: string[];

    @IsNumber()
    @IsNotEmpty({ message: 'El campo tiempoQr es requerido' })
    tiempoQr: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idSucursal es requerido' })
    idSucursal: number;

}
