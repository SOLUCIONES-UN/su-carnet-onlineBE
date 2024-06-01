import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateSucursalesAreasGruposInformacionDto {

    @IsString()
    @IsNotEmpty({ message: 'El campo descripcion es requerido' })
    descripcion: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idSucursalArea es requerido' })
    idSucursalArea: number;

}
