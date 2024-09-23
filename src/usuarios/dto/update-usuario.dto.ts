import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUsuarioDto{

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

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idTipo_usuario es requerido' })
    idTipo: number;

    @IsOptional()
    role_id: number;

    @IsOptional()
    @IsNumber({}, { each: true, message: 'Cada elemento en idAreaSucursal debe ser un número' })
    idAreaSucursal: number;
}
