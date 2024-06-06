import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateSucursalesDocumentoDto {

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idSucursal es requerido' })
    idSucursal: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idTipoDocumento es requerido' })
    idTipoDocumento: number;
    
}
