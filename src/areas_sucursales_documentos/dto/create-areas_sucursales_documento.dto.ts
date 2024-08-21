import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateAreasSucursalesDocumentoDto {
    
    @IsNumber()
    @IsNotEmpty({ message: 'El campo idAreaSucursal es requerido' })
    idAreaSucursal: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idTipoDocumento es requerido' })
    idTipoDocumento: number;
}
