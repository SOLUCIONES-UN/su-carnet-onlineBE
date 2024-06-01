import { IsNotEmpty, IsString } from "class-validator";

export class CreateTipoPaiseDto {

    @IsString()
    @IsNotEmpty({ message: 'El campo descripcion es requerido' })
    descripcion: string;
}
