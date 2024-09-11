import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateOutsoursingAfiliacioneDto {

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idOutsoursing es requerido' })
    idOutsoursing: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idRegistroInformacion es requerido' })
    idRegistroInformacion: number;
}
