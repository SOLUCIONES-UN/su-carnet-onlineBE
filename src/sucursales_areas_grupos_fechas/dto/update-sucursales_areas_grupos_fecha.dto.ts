import { PartialType } from '@nestjs/mapped-types';
import { CreateSucursalesAreasGruposFechaDto } from './create-sucursales_areas_grupos_fecha.dto';

export class UpdateSucursalesAreasGruposFechaDto extends PartialType(CreateSucursalesAreasGruposFechaDto) {}
