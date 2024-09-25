import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { SucursalesAreasInformacionService } from './sucursales_areas_informacion.service';
import { CreateSucursalesAreasInformacionDto } from './dto/create-sucursales_areas_informacion.dto';
import { UpdateSucursalesAreasInformacionDto } from './dto/update-sucursales_areas_informacion.dto';

@Controller('sucursales-areas-informacion')
export class SucursalesAreasInformacionController {
  constructor(private readonly sucursalesAreasInformacionService: SucursalesAreasInformacionService) {}

  @Post()
  async create(@Body() createSucursalesAreasInformacionDto: CreateSucursalesAreasInformacionDto) {
    
    return await this.sucursalesAreasInformacionService.create(createSucursalesAreasInformacionDto);

  }

  @Get()
  async findAll() {

    return await this.sucursalesAreasInformacionService.findAll();
  }

  @Get('SucursalesAreasInformacion/:idSucursal')
  async findAllBySucursal(@Param('idSucursal') idSucursal:number) {

    return await this.sucursalesAreasInformacionService.findAllBySucursalId(idSucursal);
  }

  @Get('AreasBySucursalId/:idSucursal')
  async AreasBySucursalId(@Param('idSucursal') idSucursal:number) {

    return await this.sucursalesAreasInformacionService.AreasBySucursalId(idSucursal);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {

    return await this.sucursalesAreasInformacionService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSucursalesAreasInformacionDto: UpdateSucursalesAreasInformacionDto) {
    
    return await this.sucursalesAreasInformacionService.update(+id, updateSucursalesAreasInformacionDto);

  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {

    return await this.sucursalesAreasInformacionService.remove(+id);

  }
  
}
