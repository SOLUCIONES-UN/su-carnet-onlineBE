import { IsNotEmpty, IsString } from "class-validator";

export class CreateTipoCategoriasServicioDto {
    
    @IsString()
    @IsNotEmpty({ message: 'El campo descripcion es requerido' })
    descripcion: string;
}
