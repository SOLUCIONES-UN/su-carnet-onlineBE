import { PartialType } from '@nestjs/mapped-types';
import { CreateSucursalesAreasGruposPuertaDto } from './create-sucursales_areas_grupos_puerta.dto';

export class UpdateSucursalesAreasGruposPuertaDto extends PartialType(CreateSucursalesAreasGruposPuertaDto) {}
