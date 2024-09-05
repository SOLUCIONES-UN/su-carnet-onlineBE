import { IsNotEmpty, IsNumber, IsString, isNumber } from "class-validator";

export class CreateRegistroDispositivoDto {

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idUsuario es requerido' })
    idUsuario: number;

    @IsString()
    @IsNotEmpty({ message: 'El campo idDispositivo es requerido' })
    idDispositivo: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo idDispositivo es requerido' })
    locacion: string;

}
