import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, NotContains } from "class-validator";

export class changePasswordDto{

    @IsString()
    @IsNotEmpty({ message: 'El campo email es requerido' })
    user: string;
    
    @IsString()
    @IsNotEmpty({ message: 'El campo password es requerido' })
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'El password debe contener por lo menos una letra mayúscula, minúsculas y un número'
    })
    @NotContains(' ', { message: 'El password no puede contener espacios en blanco' })
    newPassword: string;
}