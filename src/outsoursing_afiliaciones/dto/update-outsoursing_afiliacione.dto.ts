import { PartialType } from '@nestjs/mapped-types';
import { CreateOutsoursingAfiliacioneDto } from './create-outsoursing_afiliacione.dto';

export class UpdateOutsoursingAfiliacioneDto extends PartialType(CreateOutsoursingAfiliacioneDto) {}
