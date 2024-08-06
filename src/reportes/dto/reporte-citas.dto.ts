import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ReporteCitasDto {
    @IsString()
    @IsNotEmpty({ message: 'El campo descripcion es requerido' })
    descripcion: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo tipoform es requerido' })
    tipoform: number;
}
