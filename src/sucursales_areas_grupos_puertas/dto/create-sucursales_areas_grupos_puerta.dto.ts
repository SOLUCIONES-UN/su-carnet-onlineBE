import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateSucursalesAreasGruposPuertaDto {

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idAreaGrupo es requerido' })
    idAreaGrupo: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idPuerta es requerido' })
    idPuerta: number;
}
