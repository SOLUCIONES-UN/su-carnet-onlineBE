import { IsEmail, IsNegative, IsNotEmpty, IsNumber, IsString, isString } from "class-validator";

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
}
