import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateSucursalesAreasPermisoDto {

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
    @IsNotEmpty({ message: 'El campo generaAlerta es requerido' })
    generaAlerta: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idAreaGrupo es requerido' })
    idAreaGrupo: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idPermiso es requerido' })
    idPermiso: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idRegistro es requerido' })
    idRegistro: number;
}
