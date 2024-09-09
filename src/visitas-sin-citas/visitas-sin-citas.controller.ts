import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VisitasSinCitasService } from './visitas-sin-citas.service';
import { CreateVisitasSinCitaDto } from './dto/create-visitas-sin-cita.dto';
import { UpdateVisitasSinCitaDto } from './dto/update-visitas-sin-cita.dto';

@Controller('visitas-sin-citas')
export class VisitasSinCitasController {
  constructor(private readonly visitasSinCitasService: VisitasSinCitasService) {}

  @Post()
  create(@Body() createVisitasSinCitaDto: CreateVisitasSinCitaDto) {
    return this.visitasSinCitasService.create(createVisitasSinCitaDto);
  }

  @Get()
  findAll() {
    return this.visitasSinCitasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.visitasSinCitasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVisitasSinCitaDto: UpdateVisitasSinCitaDto) {
    return this.visitasSinCitasService.update(+id, updateVisitasSinCitaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.visitasSinCitasService.remove(+id);
  }
}
