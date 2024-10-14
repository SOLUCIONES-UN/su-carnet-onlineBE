import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { SucursalesAreasGruposInformacionService } from './sucursales_areas_grupos_informacion.service';
import { CreateSucursalesAreasGruposInformacionDto } from './dto/create-sucursales_areas_grupos_informacion.dto';
import { UpdateSucursalesAreasGruposInformacionDto } from './dto/update-sucursales_areas_grupos_informacion.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';

@Controller('sucursales-areas-grupos-informacion')
export class SucursalesAreasGruposInformacionController {
  constructor(private readonly sucursalesAreasGruposInformacionService: SucursalesAreasGruposInformacionService) {}

  @Post()
  async create(@Body() createSucursalesAreasGruposInformacionDto: CreateSucursalesAreasGruposInformacionDto) {
    
    return await this.sucursalesAreasGruposInformacionService.create(createSucursalesAreasGruposInformacionDto);

  }

  @Get()
  async findAll() {

    return await this.sucursalesAreasGruposInformacionService.findAll();
  }

  @Get('SucursalesAreasGrupos/:idSucursalArea')
  async findAllByidSucursalArea(@Param('idSucursalArea') idSucursalArea:string) {

    return await this.sucursalesAreasGruposInformacionService.findAllByAreaInformacionId(+idSucursalArea);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {

    return await this.sucursalesAreasGruposInformacionService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSucursalesAreasGruposInformacionDto: UpdateSucursalesAreasGruposInformacionDto) {
    
    await this.sucursalesAreasGruposInformacionService.update(+id, updateSucursalesAreasGruposInformacionDto);

  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {

    return await this.sucursalesAreasGruposInformacionService.remove(+id);

  }
  
}
