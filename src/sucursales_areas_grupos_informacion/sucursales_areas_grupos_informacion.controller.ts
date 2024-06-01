import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { SucursalesAreasGruposInformacionService } from './sucursales_areas_grupos_informacion.service';
import { CreateSucursalesAreasGruposInformacionDto } from './dto/create-sucursales_areas_grupos_informacion.dto';
import { UpdateSucursalesAreasGruposInformacionDto } from './dto/update-sucursales_areas_grupos_informacion.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('sucursales-areas-grupos-informacion')
export class SucursalesAreasGruposInformacionController {
  constructor(private readonly sucursalesAreasGruposInformacionService: SucursalesAreasGruposInformacionService) {}

  @Post()
  async create(@Body() createSucursalesAreasGruposInformacionDto: CreateSucursalesAreasGruposInformacionDto) {
    
    try {

      const result = await this.sucursalesAreasGruposInformacionService.create(createSucursalesAreasGruposInformacionDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al agregar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {

    try {

      const result = await this.sucursalesAreasGruposInformacionService.findAll(paginationDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {

    try {

      const result = await this.sucursalesAreasGruposInformacionService.findOne(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSucursalesAreasGruposInformacionDto: UpdateSucursalesAreasGruposInformacionDto) {
    
    try {

      const result = await this.sucursalesAreasGruposInformacionService.update(+id, updateSucursalesAreasGruposInformacionDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al editar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {

    try {

      const result = await this.sucursalesAreasGruposInformacionService.remove(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al eliminar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }
  
}
