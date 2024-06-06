import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateSucursalesAreasLogDto {

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idPuerta es requerido' })
    idPuerta: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idSucursalAreaPermiso es requerido' })
    idSucursalAreaPermiso: number;
}
