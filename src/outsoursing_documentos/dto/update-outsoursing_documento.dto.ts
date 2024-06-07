import { PartialType } from '@nestjs/mapped-types';
import { CreateOutsoursingDocumentoDto } from './create-outsoursing_documento.dto';

export class UpdateOutsoursingDocumentoDto extends PartialType(CreateOutsoursingDocumentoDto) {}
