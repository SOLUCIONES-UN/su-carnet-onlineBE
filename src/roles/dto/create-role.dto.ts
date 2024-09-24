import { IsNotEmpty, IsString } from "class-validator";

export class CreateRoleDto {

    @IsString()
    @IsNotEmpty({ message: 'El campo descripcion es requerido' })
    descripcion: string;
}
