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
  @IsNotEmpty({ message: 'El campo tipo_evento es requerido' })
  tipo_evento: number;

  @IsNumber()
  @IsNotEmpty({ message: 'El campo creado_por es requerido' })
  creado_por: number;

  @IsString()
  @IsNotEmpty({ message: 'El campo fecha_creacion es requerido' })
  fecha_creacion: Date;

  @IsString()
  @IsNotEmpty({ message: 'El campo fecha_publicacion es requerido' })
  fecha_publicacion: Date;

  @IsString()
  @IsNotEmpty({ message: 'El campo path_image  es requerido' })
  path_image: string;

  @IsString()
  @IsNotEmpty({ message: 'El campo color_letra  es requerido' })
  color_letra: string;

  @IsArray({ each: true })
  @IsNotEmpty({ message: 'El campo fechas_evento es requerido' })
  fechas_evento: FechasEvento[];

  @IsArray({ each: true })
  @IsOptional()
  archivosEvento?: number[];

  @IsArray({ each: true })
  @IsOptional()
  AreasEventos?: number[];

  @IsArray({ each: true })
  @IsOptional()
  preguntas_concurso?: preguntasConcurso[];
}

export interface preguntasConcurso {
  pregunta: string;
  respuesta: string;
}
