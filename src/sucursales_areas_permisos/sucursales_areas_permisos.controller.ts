import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { SucursalesAreasPermisosService } from './sucursales_areas_permisos.service';
import { CreateSucursalesAreasPermisoDto } from './dto/create-sucursales_areas_permiso.dto';
import { UpdateSucursalesAreasPermisoDto } from './dto/update-sucursales_areas_permiso.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';

@Controller('sucursales-areas-permisos')
export class SucursalesAreasPermisosController {
  constructor(private readonly sucursalesAreasPermisosService: SucursalesAreasPermisosService) {}

  @Post()
  async create(@Body() createSucursalesAreasPermisoDto: CreateSucursalesAreasPermisoDto) {
    
    try {

      const result = await this.sucursalesAreasPermisosService.create(createSucursalesAreasPermisoDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al agregar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {

    try {

      const result = await this.sucursalesAreasPermisosService.findAll(paginationDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('getCitasUsuario/:idUsuario')
  async getCitasUsuario(@Param('idUsuario') idUsuario: number) {

    try {

      const result = await this.sucursalesAreasPermisosService.citasUsuario(idUsuario);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSucursalesAreasPermisoDto: UpdateSucursalesAreasPermisoDto) {
    
    try {

      const result = await this.sucursalesAreasPermisosService.update(+id, updateSucursalesAreasPermisoDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al editar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {

    try {

      const result = await this.sucursalesAreasPermisosService.remove(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al eliminar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
}
