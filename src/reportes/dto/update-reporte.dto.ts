import { PartialType } from '@nestjs/mapped-types';
import { CreateReporteDto } from './reporte-citas.dto';

export class UpdateReporteDto extends PartialType(CreateReporteDto) {}
