import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateVendedoreDto {

    @IsString()
    @IsNotEmpty({ message: 'El campo nombres es requerido' })
    nombres: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo apellidos es requerido' })
    apellidos: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo codigo es requerido' })
    codigo: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo email es requerido' })
    @IsEmail( {  }, { message: 'El email debe ser un correo valido' })
    correo: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo telefono es requerido' })
    telefono: string;
    
}
