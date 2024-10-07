import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRoleDto {

    @IsString()
    @IsNotEmpty({ message: 'El campo descripcion es requerido' })
    descripcion: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo empresaId es requerido' })
    empresaId: number;
}
