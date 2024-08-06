import { PartialType } from '@nestjs/mapped-types';
import { ReporteCitasDto } from './reporte-citas.dto';

export class UpdateReporteDto extends PartialType(ReporteCitasDto) {}
