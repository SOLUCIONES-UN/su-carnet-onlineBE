import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistroColaboradoreDto } from './create-registro-colaboradore.dto';

export class UpdateRegistroColaboradoreDto extends PartialType(CreateRegistroColaboradoreDto) {}
