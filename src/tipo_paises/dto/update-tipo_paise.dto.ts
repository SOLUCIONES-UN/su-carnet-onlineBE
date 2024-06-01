import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoPaiseDto } from './create-tipo_paise.dto';

export class UpdateTipoPaiseDto extends PartialType(CreateTipoPaiseDto) {}
