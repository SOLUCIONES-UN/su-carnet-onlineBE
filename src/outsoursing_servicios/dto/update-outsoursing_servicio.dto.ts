import { PartialType } from '@nestjs/mapped-types';
import { CreateOutsoursingServicioDto } from './create-outsoursing_servicio.dto';

export class UpdateOutsoursingServicioDto extends PartialType(CreateOutsoursingServicioDto) {}
