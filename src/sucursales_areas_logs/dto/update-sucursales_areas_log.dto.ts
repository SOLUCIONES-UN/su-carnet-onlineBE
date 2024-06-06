import { PartialType } from '@nestjs/mapped-types';
import { CreateSucursalesAreasLogDto } from './create-sucursales_areas_log.dto';

export class UpdateSucursalesAreasLogDto extends PartialType(CreateSucursalesAreasLogDto) {}
