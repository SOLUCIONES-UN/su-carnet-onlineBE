import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistroInformacionDto } from './create-registro_informacion.dto';

export class UpdateRegistroInformacionDto extends PartialType(CreateRegistroInformacionDto) {}
