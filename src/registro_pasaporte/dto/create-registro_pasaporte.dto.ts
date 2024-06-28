import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRegistroPasaporteDto {

    @IsString()
    @IsNotEmpty({ message: 'El campo fechaEmision es requerido' })
    fechaEmision: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo fechaVencimiento es requerido' })
    fechaVencimiento: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idCaracteristicasSucursales es requerido' })
    idCaracteristicasSucursales: number;
}
