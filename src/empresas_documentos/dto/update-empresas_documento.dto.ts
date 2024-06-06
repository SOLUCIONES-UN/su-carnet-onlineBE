import { PartialType } from '@nestjs/mapped-types';
import { CreateEmpresasDocumentoDto } from './create-empresas_documento.dto';

export class UpdateEmpresasDocumentoDto extends PartialType(CreateEmpresasDocumentoDto) {}
