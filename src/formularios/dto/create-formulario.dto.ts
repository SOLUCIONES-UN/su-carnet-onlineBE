import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateFormularioDto {
    @IsString()
    @IsNotEmpty({ message: 'El campo descripcion es requerido' })
    descripcion: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo tipoform es requerido' })
    tipoform: number;
}
