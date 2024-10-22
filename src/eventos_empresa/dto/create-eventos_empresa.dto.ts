import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { FechasEvento } from './fechas_evento';

export class CreateEventosEmpresaDto {
  @IsNumber()
  @IsNotEmpty({ message: 'El campo idEmpresa es requerido' })
  idEmpresa: number;

  @IsString()
  @IsNotEmpty({ message: 'El campo titulo es requerido' })
  titulo: string;

  @IsString()
  @IsNotEmpty({ message: 'El campo descripcion es requerido' })
  descripcion: string;

  @IsString()
  @IsOptional()
  ubicacion?: string;

  @IsNumber()
  @IsNotEmpty({ message: 'El campo tipoEvento es requerido' })
  tipoEvento: number;

  @IsNumber()
  @IsNotEmpty({ message: 'El campo creado_por es requerido' })
  creado_por: number;

  @IsString()
  @IsNotEmpty({ message: 'El campo fechaPublicacion es requerido' })
  fechaPublicacion: String;

  @IsString()
  @IsNotEmpty({ message: 'El campo pathImage  es requerido' })
  pathImage: string;

  @IsString()
  @IsNotEmpty({ message: 'El campo color_letra  es requerido' })
  colorLetra: string;

  @IsArray({ each: true })
  @IsNotEmpty({ message: 'El campo fechas_evento es requerido' })
  fechas_evento: FechasEvento[];

  @IsArray({ message: 'El campo archivosEvento debe ser un array' })
  @IsOptional()
  @IsNumber(
    {},
    {
      each: true,
      message: 'El campo archivosEvento debe ser un array de numeros',
    },
  )
  archivosEvento?: number[];

  @IsArray({ message: 'El campo AreasEventos debe ser un array' })
  @IsOptional()
  AreasEventos?: number[];

  @IsArray({ each: true })
  @IsNotEmpty()
  preguntas_concurso: preguntasConcurso[];
}

export interface preguntasConcurso {
  pregunta: string;
  respuesta: string;
}
