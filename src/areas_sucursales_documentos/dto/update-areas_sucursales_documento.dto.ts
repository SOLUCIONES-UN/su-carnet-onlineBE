import { PartialType } from '@nestjs/mapped-types';
import { CreateAreasSucursalesDocumentoDto } from './create-areas_sucursales_documento.dto';

export class UpdateAreasSucursalesDocumentoDto extends PartialType(CreateAreasSucursalesDocumentoDto) {}
