import { PartialType } from '@nestjs/mapped-types';
import { CreateEventosEmpresaDto } from './create-eventos_empresa.dto';

export class UpdateEventosEmpresaDto extends PartialType(CreateEventosEmpresaDto) {}
