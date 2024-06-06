import { PartialType } from '@nestjs/mapped-types';
import { CreateSucursalesAreasPermisoDto } from './create-sucursales_areas_permiso.dto';

export class UpdateSucursalesAreasPermisoDto extends PartialType(CreateSucursalesAreasPermisoDto) {}
