import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateSucursalesAreasPuertaDto {

    @IsString()
    @IsNotEmpty({ message: 'El campo descripcion es requerido' })
    descripcion: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo direccionIp es requerido' })
    direccionIp: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo generaAlerta es requerido' })
    generaAlerta: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El campo idSucursalArea es requerido' })
    idSucursalArea: number;


}
