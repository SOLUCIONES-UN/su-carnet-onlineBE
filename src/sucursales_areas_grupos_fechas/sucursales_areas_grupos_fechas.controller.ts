import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { SucursalesAreasGruposFechasService } from './sucursales_areas_grupos_fechas.service';
import { CreateSucursalesAreasGruposFechaDto } from './dto/create-sucursales_areas_grupos_fecha.dto';
import { UpdateSucursalesAreasGruposFechaDto } from './dto/update-sucursales_areas_grupos_fecha.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('sucursales-areas-grupos-fechas')
export class SucursalesAreasGruposFechasController {
  constructor(private readonly sucursalesAreasGruposFechasService: SucursalesAreasGruposFechasService) {}

  @Post()
  async create(@Body() createSucursalesAreasGruposFechaDto: CreateSucursalesAreasGruposFechaDto) {
    
    try {

      const result = await this.sucursalesAreasGruposFechasService.create(createSucursalesAreasGruposFechaDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al agregar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {

    try {

      const result = await this.sucursalesAreasGruposFechasService.findAll(paginationDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSucursalesAreasGruposFechaDto: UpdateSucursalesAreasGruposFechaDto) {
    
    try {

      const result = await this.sucursalesAreasGruposFechasService.update(+id, updateSucursalesAreasGruposFechaDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al editar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {

    try {

      const result = await this.sucursalesAreasGruposFechasService.remove(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al eliminar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
