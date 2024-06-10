import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRegistroMensajeDto {

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idRegistroInformacion es requerido' })
    idRegistroInformacion: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idMensaje es requerido' })
    idMensaje: number;
    
}
