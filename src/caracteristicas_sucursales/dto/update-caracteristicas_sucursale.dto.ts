import { PartialType } from '@nestjs/mapped-types';
import { CreateCaracteristicasSucursaleDto } from './create-caracteristicas_sucursale.dto';

export class UpdateCaracteristicasSucursaleDto extends PartialType(CreateCaracteristicasSucursaleDto) {}
