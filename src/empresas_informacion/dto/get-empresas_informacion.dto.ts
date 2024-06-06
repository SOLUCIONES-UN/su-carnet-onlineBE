import { IsNotEmpty, IsString } from "class-validator";

export class getEmpresasInformacion {

    @IsString()
    @IsNotEmpty({ message: 'El campo disclaimer es requerido' })
    disclaimer: string;

    
}
