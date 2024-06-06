import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateVerificacionUsuarioDto {

    @IsString()
    @IsNotEmpty({ message: 'El campo correoElectronico es requerido' })
    @IsEmail( {  }, { message: 'El email debe ser un correo valido' })
    correoElectronico: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo formaEnvio es requerido' })
    formaEnvio: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo accion es requerido' })
    accion: string;
}
