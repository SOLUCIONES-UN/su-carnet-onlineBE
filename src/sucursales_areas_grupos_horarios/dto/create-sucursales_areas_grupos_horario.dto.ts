import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateSucursalesAreasGruposHorarioDto {

    @IsNumber()
    @IsNotEmpty({ message: 'El campo diaSemana es requerido' })
    diaSemana: number;

    
    @IsString()
    @IsNotEmpty({ message: 'El campo horaInicio es requerido' })
    horaInicio: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo horaFinal es requerido' })
    horaFinal: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idAreaGrupo es requerido' })
    idAreaGrupo: number;

}
