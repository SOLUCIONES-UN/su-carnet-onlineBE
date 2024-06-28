import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistroPasaporteDto } from './create-registro_pasaporte.dto';

export class UpdateRegistroPasaporteDto extends PartialType(CreateRegistroPasaporteDto) {}
