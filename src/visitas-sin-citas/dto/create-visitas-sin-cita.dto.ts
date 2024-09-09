import { IsNotEmpty, IsString } from "class-validator";

export class CreateVisitasSinCitaDto {

    @IsString()
    @IsNotEmpty({ message: 'El campo documentoIdentificacion es requerido' })
    documentoIdentificacion: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo nombres es requerido' })
    nombre: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo apellidos es requerido' })
    apellido: string;
}
