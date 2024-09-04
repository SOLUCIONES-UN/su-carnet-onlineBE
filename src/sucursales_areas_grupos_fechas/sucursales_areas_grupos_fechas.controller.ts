import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { SucursalesAreasGruposFechasService } from './sucursales_areas_grupos_fechas.service';
import { CreateSucursalesAreasGruposFechaDto } from './dto/create-sucursales_areas_grupos_fecha.dto';
import { UpdateSucursalesAreasGruposFechaDto } from './dto/update-sucursales_areas_grupos_fecha.dto';

@Controller('sucursales-areas-grupos-fechas')
export class SucursalesAreasGruposFechasController {
  constructor(private readonly sucursalesAreasGruposFechasService: SucursalesAreasGruposFechasService) {}

  @Post()
  async create(@Body() createSucursalesAreasGruposFechaDto: CreateSucursalesAreasGruposFechaDto) {
    return  await this.sucursalesAreasGruposFechasService.create(createSucursalesAreasGruposFechaDto);
  }

  @Get()
  async findAll() {
    return await this.sucursalesAreasGruposFechasService.findAll();
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSucursalesAreasGruposFechaDto: UpdateSucursalesAreasGruposFechaDto) {
    return await this.sucursalesAreasGruposFechasService.update(+id, updateSucursalesAreasGruposFechaDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.sucursalesAreasGruposFechasService.remove(+id);
  }
}
