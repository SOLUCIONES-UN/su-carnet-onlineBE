import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoCategoriasServicioDto } from './create-tipo_categorias_servicio.dto';

export class UpdateTipoCategoriasServicioDto extends PartialType(CreateTipoCategoriasServicioDto) {}
