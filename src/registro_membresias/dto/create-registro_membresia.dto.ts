import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRegistroMembresiaDto {

    @IsString() 
    @IsNotEmpty({ message: 'El campo fechaInicio es requerido' })
    fechaInicio: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo fechaVencimiento es requerido' })
    fechaVencimiento: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo idExterno es requerido' })
    idExterno: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo membresiaInformacion es requerido' })
    membresiaInformacion: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo registroInformacion es requerido' })
    idUsuario: number;
}
