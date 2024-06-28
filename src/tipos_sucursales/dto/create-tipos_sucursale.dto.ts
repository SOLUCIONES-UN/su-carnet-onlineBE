import { IsNotEmpty, IsString } from "class-validator";

export class CreateTiposSucursaleDto {

    @IsString()
    @IsNotEmpty({ message: 'El campo descripcion es requerido' })
    descripcion: string;
}
