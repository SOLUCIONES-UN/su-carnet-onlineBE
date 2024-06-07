import { PartialType } from '@nestjs/mapped-types';
import { CreateOutsoursingInformacionDto } from './create-outsoursing_informacion.dto';

export class UpdateOutsoursingInformacionDto extends PartialType(CreateOutsoursingInformacionDto) {}
