import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateEmpresasMensajeDto {

    @IsString()
    @IsNotEmpty({ message: 'El campo titulo es requerido' })
    titulo: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo contenido es requerido' })
    contenido: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo accion es requerido' })
    accion: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idEmpresa es requerido' })
    idEmpresa: number;
}
