import { IsNotEmpty, IsNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUsuarioDto {

    @IsString()
    @IsNotEmpty({ message: 'El campo nombres es requerido' })
    nombres: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo apellidos es requerido' })
    apellidos: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo email es requerido' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo password es requerido' })
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'El password debe contener por lo menos una letra mayuscula, minusculas y un numero'
    })
    password: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idTipo_usuario es requerido' })
    idTipo: number;

}
