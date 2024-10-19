import { PartialType } from '@nestjs/mapped-types';
import { CreateAreasEventoDto } from './create-areas_evento.dto';

export class UpdateAreasEventoDto extends PartialType(CreateAreasEventoDto) {}
