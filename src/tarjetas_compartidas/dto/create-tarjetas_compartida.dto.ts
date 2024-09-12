import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateTarjetasCompartidaDto {

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idtarjetaleida es requerido' })
    idtarjetaleida: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idusuario es requerido' })
    idusuario: number;
    
}
