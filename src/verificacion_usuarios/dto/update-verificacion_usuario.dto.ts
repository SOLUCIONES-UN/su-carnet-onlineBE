import { PartialType } from '@nestjs/mapped-types';
import { CreateVerificacionUsuarioDto } from './create-verificacion_usuario.dto';

export class UpdateVerificacionUsuarioDto extends PartialType(CreateVerificacionUsuarioDto) {}
