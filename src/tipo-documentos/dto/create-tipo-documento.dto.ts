import { IsNotEmpty, IsString } from "class-validator";

export class CreateTipoDocumentoDto {

    @IsString()
    @IsNotEmpty({ message: 'El campo descripcion es requerido' })
    descripcion: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo necesitaValidacion es requerido' })
    necesitaValidacion: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo tieneVencimiento es requerido' })
    tieneVencimiento: string;
}
