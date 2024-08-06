import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ReporteCitasDto {
    @IsString()
    @IsNotEmpty({ message: 'El campo fechaInicio es requerido' })
    fechaInicio: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo fechaFinal es requerido' })
    fechaFinal: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idAreaSucursal es requerido' })
    idAreaSucursal: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idUsuario es requerido' })
    idUsuario: number;

    @IsString()
    @IsNotEmpty({ message: 'El campo identificadorReporte es requerido' })
    identificadorReport: string;
}
