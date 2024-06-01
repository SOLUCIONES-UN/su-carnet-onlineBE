import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoPermisoDto } from './create-tipo_permiso.dto';

export class UpdateTipoPermisoDto extends PartialType(CreateTipoPermisoDto) {}
