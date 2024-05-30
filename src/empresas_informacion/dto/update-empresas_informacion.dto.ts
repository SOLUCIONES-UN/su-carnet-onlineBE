import { PartialType } from '@nestjs/mapped-types';
import { CreateEmpresasInformacionDto } from './create-empresas_informacion.dto';

export class UpdateEmpresasInformacionDto extends PartialType(CreateEmpresasInformacionDto) {}
