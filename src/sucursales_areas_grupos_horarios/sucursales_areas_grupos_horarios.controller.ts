import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { SucursalesAreasGruposHorariosService } from './sucursales_areas_grupos_horarios.service';
import { CreateSucursalesAreasGruposHorarioDto } from './dto/create-sucursales_areas_grupos_horario.dto';
import { UpdateSucursalesAreasGruposHorarioDto } from './dto/update-sucursales_areas_grupos_horario.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('sucursales-areas-grupos-horarios')
export class SucursalesAreasGruposHorariosController {
  constructor(private readonly sucursalesAreasGruposHorariosService: SucursalesAreasGruposHorariosService) {}

  @Post()
  async create(@Body() createSucursalesAreasGruposHorarioDto: CreateSucursalesAreasGruposHorarioDto) {
    
    try {

      const result = await this.sucursalesAreasGruposHorariosService.create(createSucursalesAreasGruposHorarioDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al agregar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {

    try {

      const result = await this.sucursalesAreasGruposHorariosService.findAll(paginationDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSucursalesAreasGruposHorarioDto: UpdateSucursalesAreasGruposHorarioDto) {
    
    try {

      const result = await this.sucursalesAreasGruposHorariosService.update(+id, updateSucursalesAreasGruposHorarioDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al editar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {

    try {

      const result = await this.sucursalesAreasGruposHorariosService.remove(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al eliminar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
