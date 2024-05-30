import { PartialType } from '@nestjs/mapped-types';
import { CreateSucursalesInformacionDto } from './create-sucursales_informacion.dto';

export class UpdateSucursalesInformacionDto extends PartialType(CreateSucursalesInformacionDto) {}
