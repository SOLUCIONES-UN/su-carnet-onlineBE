import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TarjetasCompartidasService } from './tarjetas_compartidas.service';
import { CreateTarjetasCompartidaDto } from './dto/create-tarjetas_compartida.dto';
import { UpdateTarjetasCompartidaDto } from './dto/update-tarjetas_compartida.dto';

@Controller('tarjetas-compartidas')
export class TarjetasCompartidasController {
  constructor(private readonly tarjetasCompartidasService: TarjetasCompartidasService) {}

  @Post()
  create(@Body() createTarjetasCompartidaDto: CreateTarjetasCompartidaDto) {
    return this.tarjetasCompartidasService.create(createTarjetasCompartidaDto);
  }

  @Get()
  findAll() {
    return this.tarjetasCompartidasService.findAll();
  }

  @Get('findAllByUsuario/:idUusario')
  findAllByUsuario(@Param('idUusario') idUusario: number) {
    return this.tarjetasCompartidasService.findAllByUsuario(idUusario);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tarjetasCompartidasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTarjetasCompartidaDto: UpdateTarjetasCompartidaDto) {
    return this.tarjetasCompartidasService.update(+id, updateTarjetasCompartidaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tarjetasCompartidasService.remove(+id);
  }
}
