import { PartialType } from '@nestjs/mapped-types';
import { CreateSucursalesAreasPuertaDto } from './create-sucursales_areas_puerta.dto';

export class UpdateSucursalesAreasPuertaDto extends PartialType(CreateSucursalesAreasPuertaDto) {}
