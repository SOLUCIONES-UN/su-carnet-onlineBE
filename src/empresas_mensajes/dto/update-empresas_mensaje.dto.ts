import { PartialType } from '@nestjs/mapped-types';
import { CreateEmpresasMensajeDto } from './create-empresas_mensaje.dto';

export class UpdateEmpresasMensajeDto extends PartialType(CreateEmpresasMensajeDto) {}
