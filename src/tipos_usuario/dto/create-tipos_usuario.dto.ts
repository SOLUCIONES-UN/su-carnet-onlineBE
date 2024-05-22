import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateTiposUsuarioDto {
    
    @IsString()
    @MinLength(1)
    @IsNotEmpty({ message: 'El campo descripcion es requerido' })
    descripcion: string;
}
