import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRegistroColaboradoreDto {
    
    @IsNumber()
    @IsNotEmpty({ message: 'El campo idEmpresa es requerido' })
    idEmpresa: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idUsuario es requerido' })
    idUsuario: number;

    @IsString()
    @IsNotEmpty({ message: 'El campo estado es requerido' })
    estado: string;
}
