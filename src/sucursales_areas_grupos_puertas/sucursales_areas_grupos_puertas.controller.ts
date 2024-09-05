import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { SucursalesAreasGruposPuertasService } from './sucursales_areas_grupos_puertas.service';
import { CreateSucursalesAreasGruposPuertaDto } from './dto/create-sucursales_areas_grupos_puerta.dto';

@Controller('sucursales-areas-grupos-puertas')
export class SucursalesAreasGruposPuertasController {
  constructor(private readonly sucursalesAreasGruposPuertasService: SucursalesAreasGruposPuertasService) {}

  @Post()
  async create(@Body() createSucursalesAreasGruposPuertaDto: CreateSucursalesAreasGruposPuertaDto) {
    return this.sucursalesAreasGruposPuertasService.create(createSucursalesAreasGruposPuertaDto);
  }

  @Get(':idEmpresa')
  async findAll(@Param('idEmpresa', ParseIntPipe) idEmpresa: number) {
    return await this.sucursalesAreasGruposPuertasService.findAll(idEmpresa);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.sucursalesAreasGruposPuertasService.remove(+id);
  }
}
