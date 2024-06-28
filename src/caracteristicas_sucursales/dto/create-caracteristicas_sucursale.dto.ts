import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCaracteristicasSucursaleDto {

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
    @IsNotEmpty({ message: 'El campo usaSelfie es requerido' })
    usaSelfie: number;
}
