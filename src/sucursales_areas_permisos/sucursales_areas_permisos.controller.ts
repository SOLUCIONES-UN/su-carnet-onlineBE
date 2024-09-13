import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { SucursalesAreasPermisosService } from './sucursales_areas_permisos.service';
import { CreateSucursalesAreasPermisoDto } from './dto/create-sucursales_areas_permiso.dto';
import { UpdateSucursalesAreasPermisoDto } from './dto/update-sucursales_areas_permiso.dto';

@Controller('sucursales-areas-permisos')
export class SucursalesAreasPermisosController {
  constructor(private readonly sucursalesAreasPermisosService: SucursalesAreasPermisosService) {}

  @Post()
  async create(@Body() createSucursalesAreasPermisoDto: CreateSucursalesAreasPermisoDto) {
    return await this.sucursalesAreasPermisosService.create(createSucursalesAreasPermisoDto);
  }

  @Get()
  async findAll() {
    return await this.sucursalesAreasPermisosService.findAll();
  }

  @Get('getCitasUsuario/:idUsuario')
  async getCitasUsuario(@Param('idUsuario') idUsuario: number) {
    return await this.sucursalesAreasPermisosService.citasUsuario(idUsuario);
  }

  @Get('getCitasArea/:idArea')
  async getCitasArea(@Param('idArea') idArea: number) {
    return await this.sucursalesAreasPermisosService.citasArea(idArea);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSucursalesAreasPermisoDto: UpdateSucursalesAreasPermisoDto) {
    return await this.sucursalesAreasPermisosService.update(+id, updateSucursalesAreasPermisoDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.sucursalesAreasPermisosService.remove(+id);
  }
  
}
