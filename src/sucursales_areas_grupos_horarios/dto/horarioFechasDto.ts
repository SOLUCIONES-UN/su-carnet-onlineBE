import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class horarioFechasDto{

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idGrupo es requerido' })
    idGrupo: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idArea es requerido' })
    idArea: number;
    
    @IsString()
    @IsNotEmpty({ message: 'El campo fecha es requerido' })
    fecha: string;
}