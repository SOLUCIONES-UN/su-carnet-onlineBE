import { PartialType } from '@nestjs/mapped-types';
import { CreateSucursalesDocumentoDto } from './create-sucursales_documento.dto';

export class UpdateSucursalesDocumentoDto extends PartialType(CreateSucursalesDocumentoDto) {}
