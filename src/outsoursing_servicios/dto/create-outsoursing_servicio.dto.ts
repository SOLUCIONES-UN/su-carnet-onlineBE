import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateOutsoursingServicioDto {

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idOutsoursing es requerido' })
    idOutsoursing: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idServicio es requerido' })
    idServicio: number;
}
