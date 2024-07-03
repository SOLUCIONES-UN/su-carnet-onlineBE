import { IsNotEmpty, IsNumber, IsString, isNumber } from "class-validator";

export class CreateRegistroMembresiaDto {

    @IsString()
    @IsNotEmpty({ message: 'El campo fechaInicio es requerido' })
    fechaInicio: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo fechaVencimiento es requerido' })
    fechaVencimiento: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idCaracteristicasSucursales es requerido' })
    idCaracteristicasSucursales: number;
}