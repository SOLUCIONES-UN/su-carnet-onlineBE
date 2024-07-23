import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateDispositivoDto {

    @IsString()
    @IsNotEmpty({ message: 'El campo tokendispositivo es requerido' })
    tokendispositivo: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idusuario es requerido' })
    idusuario: number;
}
