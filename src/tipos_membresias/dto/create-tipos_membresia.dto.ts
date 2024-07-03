import { IsNotEmpty, IsString } from "class-validator";

export class CreateTiposMembresiaDto {
    
    @IsString()
    @IsNotEmpty({ message: 'El campo descripcion es requerido' })
    descripcion: string;
}
