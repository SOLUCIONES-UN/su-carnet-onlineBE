import { IsArray, IsNotEmpty, IsNumber, isNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class updateStateDto {

    @IsNumber()
    @IsNotEmpty({ message: 'El estado es requerido' })
    estado: number;

    @IsArray()
    @IsNotEmpty({ message: 'El array idsNotificaciones es requerido' })
    idsNotificaciones: number[];

}