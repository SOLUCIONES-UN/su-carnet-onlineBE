import { PartialType } from '@nestjs/mapped-types';
import { CreateMembresiaInformacionDto } from './create-membresia_informacion.dto';

export class UpdateMembresiaInformacionDto extends PartialType(CreateMembresiaInformacionDto) {}
