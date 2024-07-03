import { PartialType } from '@nestjs/mapped-types';
import { CreateTiposMembresiaDto } from './create-tipos_membresia.dto';

export class UpdateTiposMembresiaDto extends PartialType(CreateTiposMembresiaDto) {}
