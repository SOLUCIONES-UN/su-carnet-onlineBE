import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistroMensajeDto } from './create-registro_mensaje.dto';

export class UpdateRegistroMensajeDto extends PartialType(CreateRegistroMensajeDto) {}
