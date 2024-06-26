import { IsNotEmpty, IsString } from "class-validator";

export class RegistrarFotoPerfilDto{

    @IsString()
    @IsNotEmpty({ message: 'El campo user es requerido' })
    user: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo fotoPerfil es requerido' })
    fotoPerfil: string;
}