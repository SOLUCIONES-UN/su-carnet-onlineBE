import { PartialType } from '@nestjs/mapped-types';
import { CreateTarjetasCompartidaDto } from './create-tarjetas_compartida.dto';

export class UpdateTarjetasCompartidaDto extends PartialType(CreateTarjetasCompartidaDto) {}
