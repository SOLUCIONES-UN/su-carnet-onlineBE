import { PartialType } from '@nestjs/mapped-types';
import { CreateSucursalesAreasGruposHorarioDto } from './create-sucursales_areas_grupos_horario.dto';

export class UpdateSucursalesAreasGruposHorarioDto extends PartialType(CreateSucursalesAreasGruposHorarioDto) {}
