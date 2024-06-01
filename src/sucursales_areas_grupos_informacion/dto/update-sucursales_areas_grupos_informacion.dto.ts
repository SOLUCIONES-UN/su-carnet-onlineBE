import { PartialType } from '@nestjs/mapped-types';
import { CreateSucursalesAreasGruposInformacionDto } from './create-sucursales_areas_grupos_informacion.dto';

export class UpdateSucursalesAreasGruposInformacionDto extends PartialType(CreateSucursalesAreasGruposInformacionDto) {}
