import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMembresiaInformacionDto {

    @IsString()
    @IsNotEmpty({ message: 'El campo logo es requerido' })
    logo: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo colorFondo es requerido' })
    colorFondo: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo colorTexto es requerido' })
    colorTexto: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo codigoBarraOQr es requerido' })
    codigoBarraOQr: number;

    @IsString()
    @IsNotEmpty({ message: 'El campo nombre es requerido' })
    nombre: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo muestraSelfie es requerido' })
    muestraSelfie: number;

    @IsString()
    @IsNotEmpty({ message: 'El campo imagen es requerido' })
    imagen: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo empresa es requerido' })
    empresa: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo tipoMembresia es requerido' })
    tipoMembresia: number;
}
