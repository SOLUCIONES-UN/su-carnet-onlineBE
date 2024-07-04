import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistroMembresiaDto } from './create-registro_membresia.dto';

export class UpdateRegistroMembresiaDto extends PartialType(CreateRegistroMembresiaDto) {}
