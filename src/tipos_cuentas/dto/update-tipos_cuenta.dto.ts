import { PartialType } from '@nestjs/mapped-types';
import { CreateTiposCuentaDto } from './create-tipos_cuenta.dto';

export class UpdateTiposCuentaDto extends PartialType(CreateTiposCuentaDto) {}
