import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTiposCuentaDto {

    @IsString()
    @IsNotEmpty({ message: 'El campo descripcion es requerido' })
    descripcion: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo precio es requerido' })
    precio: string;
}
