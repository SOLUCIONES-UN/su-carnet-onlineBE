import { PartialType } from '@nestjs/mapped-types';
import { CreateSucursalesAreasInformacionDto } from './create-sucursales_areas_informacion.dto';

export class UpdateSucursalesAreasInformacionDto extends PartialType(CreateSucursalesAreasInformacionDto) {}
