import { IsNotEmpty, IsString } from "class-validator";

export class registrarFotoPerfilDto{

    @IsString()
    @IsNotEmpty({ message: 'El campo usuario es requerido' })
    fotoperfil2: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo fotoPerfil es requerido' })
    fotoPerfil: string;
}