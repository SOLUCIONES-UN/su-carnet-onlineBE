import { IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class CreateTiposUsuarioDto {
    
    @IsString()
    @MinLength(1)
    @IsNotEmpty({ message: 'El campo descripcion es requerido' })
    descripcion: string;
    @IsNumber()
    @IsNotEmpty({ message: 'El campo  nivel_id es requerido' })
    nivel_id: number;
}
