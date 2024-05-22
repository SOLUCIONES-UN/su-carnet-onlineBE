import { IsString, MinLength } from "class-validator";

export class CreateTiposUsuarioDto {
    
    @IsString()
    @MinLength(1)
    descripcion: string;
}
