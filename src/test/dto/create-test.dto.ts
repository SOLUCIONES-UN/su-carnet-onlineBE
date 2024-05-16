import { IsString, MinLength } from "class-validator";

export class CreateTestDto {

    //Agregar validaciones en las clases DTO
    @IsString()
    @MinLength(3)
    nombre: string;

}
