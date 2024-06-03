import { IsNotEmpty, IsString } from "class-validator";

export class confirmarUsuario {

    @IsString()
    @IsNotEmpty({ message: 'El campo correoElectronico es requerido' })
    correoElectronico: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo otp es requerido' })
    otp: string;
}
