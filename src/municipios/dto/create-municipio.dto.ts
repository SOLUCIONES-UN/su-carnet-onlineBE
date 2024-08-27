import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMunicipioDto {

    @IsString()
    @IsNotEmpty({ message: 'El campo descripcion es requerido' })
    descripcion: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo iddepartamento es requerido' })
    iddepartamento: number
}
