import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistroDocumentoDto } from './create-registro_documento.dto';

export class UpdateRegistroDocumentoDto extends PartialType(CreateRegistroDocumentoDto) {}
