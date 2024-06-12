import { PartialType } from '@nestjs/mapped-types';
import { CreateTarjetaPresentacionDto } from './create-tarjeta_presentacion.dto';

export class UpdateTarjetaPresentacionDto extends PartialType(CreateTarjetaPresentacionDto) {}
