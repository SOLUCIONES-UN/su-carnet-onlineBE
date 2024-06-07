import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateOutsoursingAfiliacioneDto {

    @IsString()
    @IsNotEmpty({ message: 'El campo fechaSolicitud es requerido' })
    fechaSolicitud: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo fechaInicio es requerido' })
    fechaInicio: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idOutsoursing es requerido' })
    idOutsoursing: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idRegistroInformacion es requerido' })
    idRegistroInformacion: number;
}
