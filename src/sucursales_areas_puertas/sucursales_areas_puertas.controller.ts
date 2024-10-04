import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { SucursalesAreasPuertasService } from './sucursales_areas_puertas.service';
import { CreateSucursalesAreasPuertaDto } from './dto/create-sucursales_areas_puerta.dto';
import { UpdateSucursalesAreasPuertaDto } from './dto/update-sucursales_areas_puerta.dto';

@Controller('sucursales-areas-puertas')
export class SucursalesAreasPuertasController {
  constructor(private readonly sucursalesAreasPuertasService: SucursalesAreasPuertasService) {}

  @Post()
  async create(@Body() createSucursalesAreasPuertaDto: CreateSucursalesAreasPuertaDto) {
    return await this.sucursalesAreasPuertasService.create(createSucursalesAreasPuertaDto);
  }

  @Get()
  async findAll() {
    return  await this.sucursalesAreasPuertasService.findAll();
  }

  @Get('findAllByArea/:idArea')
  async findAllByArea(@Param('idArea') idArea: number) {
    return await this.sucursalesAreasPuertasService.findAllByArea(idArea);
  }

  @Get('areasGruposByPuerta/:idPuerta')
  async areasGruposByPuerta(@Param('idPuerta') idPuerta: number) {
    return await this.sucursalesAreasPuertasService.areasGruposByPuerta(idPuerta);
  }

  @Get('findAllByEmpresa/:idEmpresa')
  async findAllByEmpresa(@Param('idEmpresa') idEmpresa: number) {
    return await this.sucursalesAreasPuertasService.findAllByEmpresa(idEmpresa);
  }

  @Get('findAllBySucursal/:idSucursal')
  async findAllBySucursal(@Param('idSucursal') idSucursal: number) {
    return await this.sucursalesAreasPuertasService.findAllBySucursal(idSucursal);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.sucursalesAreasPuertasService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSucursalesAreasPuertaDto: UpdateSucursalesAreasPuertaDto) {
    return await this.sucursalesAreasPuertasService.update(+id, updateSucursalesAreasPuertaDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.sucursalesAreasPuertasService.remove(+id);
  }

}
