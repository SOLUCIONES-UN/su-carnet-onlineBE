import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateOutsoursingDocumentoDto {

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idDocumento es requerido' })
    idDocumento: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idOutsoursing es requerido' })
    idOutsoursing: number;
}
