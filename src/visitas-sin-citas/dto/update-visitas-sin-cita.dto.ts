import { PartialType } from '@nestjs/mapped-types';
import { CreateVisitasSinCitaDto } from './create-visitas-sin-cita.dto';

export class UpdateVisitasSinCitaDto extends PartialType(CreateVisitasSinCitaDto) {}
