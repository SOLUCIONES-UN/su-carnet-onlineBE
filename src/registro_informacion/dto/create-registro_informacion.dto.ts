import { IsEmail, IsNegative, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MaxLength, NotContains, isString } from "class-validator";

export class CreateRegistroInformacionDto {

    @IsString()
    @IsNotEmpty({ message: 'El campo documento es requerido' })
    documento: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo nombres es requerido' })
    nombres: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo apellidos es requerido' })
    apellidos: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo fechaNacimiento es requerido' })
    fechaNacimiento: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo telefono es requerido' })
    telefono: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo correo es requerido' })
    @IsEmail( {  }, { message: 'El email debe ser un correo valido' })
    correo: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo contactoEmergenciaNombre es requerido' })
    contactoEmergenciaNombre: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo contactoEmergenciaTelefono es requerido' })
    contactoEmergenciaTelefono: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idPais es requerido' })
    idPais: number;

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
    @IsOptional()
    idTipo: number;

    @IsOptional()
    @IsNumber({}, { each: true, message: 'Cada elemento en idEmpresas debe ser un número' })
    idEmpresas: number;

    @IsOptional()
    @IsNumber({}, { each: true, message: 'Cada elemento en idSucursal debe ser un número' })
    idSucursal: number;

    @IsOptional()
    @IsNumber({}, { each: true, message: 'Cada elemento en idAreaSucursal debe ser un número' })
    idAreaSucursal: number;
    
}
