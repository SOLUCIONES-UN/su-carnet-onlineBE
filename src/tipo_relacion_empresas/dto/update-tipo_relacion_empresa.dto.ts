import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoRelacionEmpresaDto } from './create-tipo_relacion_empresa.dto';

export class UpdateTipoRelacionEmpresaDto extends PartialType(CreateTipoRelacionEmpresaDto) {}
