import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, isNumber } from "class-validator";

export class CreateEmpresasInformacionDto {

    @IsString()
    @IsNotEmpty({ message: 'El campo nombres es requerido' })
    nombre: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo disclaimer es requerido' })
    disclaimer: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo codigoEmpresa es requerido' })
    codigoEmpresa: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo fechaVencimiento es requerido' })
    fechaVencimiento: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo facturaNit es requerido' })
    facturaNit: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo facturaNombre es requerido' })
    facturaNombre: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo facturaDireccion es requerido' })
    facturaDireccion: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo facturaCorreo es requerido' })
    @IsEmail( {  }, { message: 'El email debe ser un correo valido' })
    facturaCorreo: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo facturaMonto es requerido' })
    facturaMonto: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo facturaDescripcion es requerido' })
    facturaDescripcion: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo miembro es requerido' })
    miembro: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo logotipo es requerido' })
    logotipo: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo sitioWeb es requerido' })
    sitioWeb: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo terminosCondiciones es requerido' })
    terminosCondiciones: string;

    @IsNumber()
    @IsOptional()
    idVendedor: number;
    
}
