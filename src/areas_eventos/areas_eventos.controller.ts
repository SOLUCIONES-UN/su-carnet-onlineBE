import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AreasEventosService } from './areas_eventos.service';
import { CreateAreasEventoDto } from './dto/create-areas_evento.dto';
import { UpdateAreasEventoDto } from './dto/update-areas_evento.dto';

@Controller('areas-eventos')
export class AreasEventosController {
  constructor(private readonly areasEventosService: AreasEventosService) {}

  @Post()
  create(@Body() createAreasEventoDto: CreateAreasEventoDto) {
    return this.areasEventosService.create(createAreasEventoDto);
  }

  @Get()
  findAll() {
    return this.areasEventosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.areasEventosService.findAllByEmpresa(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAreasEventoDto: UpdateAreasEventoDto,
  ) {
    return this.areasEventosService.update(+id, updateAreasEventoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.areasEventosService.remove(+id);
  }
}
