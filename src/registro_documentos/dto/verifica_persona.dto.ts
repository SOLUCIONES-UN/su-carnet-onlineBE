import { IsNotEmpty, IsString } from "class-validator";

export class verificPerson {

    @IsString()
    @IsNotEmpty({ message: 'El campo sourceImagePath es requerido' })
    sourceImagePath: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo targetImagePath es requerido' })
    targetImagePath: string;
}
