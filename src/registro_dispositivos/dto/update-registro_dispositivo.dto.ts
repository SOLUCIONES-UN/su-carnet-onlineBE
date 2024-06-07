import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistroDispositivoDto } from './create-registro_dispositivo.dto';

export class UpdateRegistroDispositivoDto extends PartialType(CreateRegistroDispositivoDto) {}
