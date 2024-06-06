import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRegistroDocumentoDto {

    @IsString()
    @IsNotEmpty({ message: 'El campo fechaVencimiento es requerido' })
    fechaVencimiento: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo archivo es requerido' })
    archivo: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo numero es requerido' })
    numero: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idRegistroInformacion es requerido' })
    idRegistroInformacion: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idTipoDocumento es requerido' })
    idTipoDocumento: number;
}
