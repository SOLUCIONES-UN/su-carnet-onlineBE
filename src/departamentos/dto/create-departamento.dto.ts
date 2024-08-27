import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateDepartamentoDto {
    
    @IsString()
    @IsNotEmpty({ message: 'El campo descripcion es requerido' })
    descripcion: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idpais es requerido' })
    idpais: number
}
