import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistroAfiliacioneDto } from './create-registro_afiliacione.dto';

export class UpdateRegistroAfiliacioneDto extends PartialType(CreateRegistroAfiliacioneDto) {}
