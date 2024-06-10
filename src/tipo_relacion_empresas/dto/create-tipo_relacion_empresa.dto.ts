import { IsNotEmpty, IsString } from "class-validator";

export class CreateTipoRelacionEmpresaDto {

    @IsString()
    @IsNotEmpty({ message: 'El campo descripcion es requerido' })
    descripcion: string;
}
