import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class ResponseFormDto {
  @IsArray({ each: true })
  @IsNotEmpty()
  respuestas: respuestas[];
}

class respuestas {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  idFormulario: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  idUsuario: number;

  @IsNotEmpty()
  @IsString()
  respuesta: string;
}
