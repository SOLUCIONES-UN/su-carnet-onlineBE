import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { IsNull } from "typeorm";

export class CreateRegistroAfiliacioneDto {

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idEmpresa es requerido' })
    idEmpresa: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idUsuario es requerido' })
    idUsuario: number;

    @IsString()
    @IsNotEmpty({ message: 'El campo estado es requerido' })
    estado: string;
}
