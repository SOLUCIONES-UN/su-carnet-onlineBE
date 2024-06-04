import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTipoServicioDto {

    @IsString()
    @IsNotEmpty({ message: 'El campo descripcion es requerido' })
    descripcion: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo informacion es requerido' })
    informacion: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idCategoria es requerido' })
    idCategoria: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idEmpresa es requerido' })
    idEmpresa: number;
    
}
