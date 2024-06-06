import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateEmpresasDocumentoDto {
    @IsNumber()
    @IsNotEmpty({ message: 'El campo idEmpresa es requerido' })
    idEmpresa: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idTipoDocumento es requerido' })
    idTipoDocumento: number;
}
