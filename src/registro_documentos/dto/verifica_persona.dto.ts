import { IsNotEmpty, IsString } from "class-validator";

export class verificPerson {

    @IsString()
    @IsNotEmpty({ message: 'El campo foto_dpi es requerido' })
    foto_dpi: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo user es requerido' })
    user: string;
}
