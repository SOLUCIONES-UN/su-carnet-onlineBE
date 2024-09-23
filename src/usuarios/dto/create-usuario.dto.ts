import { ArrayNotEmpty, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MaxLength, NotContains } from "class-validator";

export class CreateUsuarioDto {

    @IsString()
    @IsNotEmpty({ message: 'El campo nombres es requerido' })
    nombres: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo apellidos es requerido' })
    apellidos: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo email es requerido' })
    @IsEmail( {  }, { message: 'El email debe ser un correo valido' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo telefono es requerido' })
    telefono: string;

    @IsString()
    @IsOptional()
    fotoPerfil: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo password es requerido' })
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'El password debe contener por lo menos una letra mayúscula, minúsculas y un número'
    })
    @NotContains(' ', { message: 'El password no puede contener espacios en blanco' })
    password: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idTipo_usuario es requerido' })
    idTipo: number;

    @IsOptional()
    role_id: number;

    // @IsOptional()
    // @IsNumber({}, { each: true, message: 'Cada elemento en idEmpresas debe ser un número' })
    // idEmpresas: number;

    // @IsOptional()
    // @IsNumber({}, { each: true, message: 'Cada elemento en idSucursal debe ser un número' })
    // idSucursal: number;

    @IsOptional()
    @IsNumber({}, { each: true, message: 'Cada elemento en idAreaSucursal debe ser un número' })
    idAreaSucursal: number;

}
