import { PartialType } from '@nestjs/mapped-types';
import { CreateTiposSucursaleDto } from './create-tipos_sucursale.dto';

export class UpdateTiposSucursaleDto extends PartialType(CreateTiposSucursaleDto) {}
