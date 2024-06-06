import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateSucursalesAreasGruposFechaDto {
    
    @IsString()
    @IsNotEmpty({ message: 'El campo fecha es requerido' })
    fecha: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo horaInicio es requerido' })
    horaInicio: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo horaFinal es requerido' })
    horaFinal: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo tipo es requerido' })
    tipo: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idAreaGrupo es requerido' })
    idAreaGrupo: number;
}
