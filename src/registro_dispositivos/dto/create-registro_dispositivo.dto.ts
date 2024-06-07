import { IsNotEmpty, IsNumber, IsString, isNumber } from "class-validator";

export class CreateRegistroDispositivoDto {

    @IsString()
    @IsNotEmpty({ message: 'El campo fechaUltimoUso es requerido' })
    fechaUltimoUso: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idRegistroInformacion es requerido' })
    idRegistroInformacion: number;

}
