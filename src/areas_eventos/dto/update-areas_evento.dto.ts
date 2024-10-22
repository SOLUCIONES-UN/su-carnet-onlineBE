import { PartialType } from '@nestjs/mapped-types';
import { CreateAreasEventoDto } from './create-areas_evento.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateAreasEventoDto extends PartialType(CreateAreasEventoDto) {
  @IsNotEmpty()
  idEmpresa: number;
}
