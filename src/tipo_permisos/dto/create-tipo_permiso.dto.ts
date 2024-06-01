import { IsNotEmpty, IsString } from "class-validator";

export class CreateTipoPermisoDto {
    
    @IsString()
    @IsNotEmpty({ message: 'El campo descripcion es requerido' })
    descripcion: string;
}
