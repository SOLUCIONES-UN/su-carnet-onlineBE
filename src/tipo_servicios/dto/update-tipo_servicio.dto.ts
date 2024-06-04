import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoServicioDto } from './create-tipo_servicio.dto';

export class UpdateTipoServicioDto extends PartialType(CreateTipoServicioDto) {}
