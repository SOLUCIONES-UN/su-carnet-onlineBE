import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { TipoPermisosService } from './tipo_permisos.service';
import { CreateTipoPermisoDto } from './dto/create-tipo_permiso.dto';
import { UpdateTipoPermisoDto } from './dto/update-tipo_permiso.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('tipo-permisos')
export class TipoPermisosController {
  constructor(private readonly tipoPermisosService: TipoPermisosService) {}

  @Post()
  async create(@Body() createTipoPermisoDto: CreateTipoPermisoDto) {
   
    try {
      
      const result = await this.tipoPermisosService.create(createTipoPermisoDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al agregar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    
    try {

      const result = await this.tipoPermisosService.findAll(paginationDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }
  @Get(':id')
  async findOne(@Param('id') id: string) {

    try {

      const result = await this.tipoPermisosService.findOne(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTipoPermisoDto: UpdateTipoPermisoDto) {
    
    try {

      const result = await this.tipoPermisosService.update(+id, updateTipoPermisoDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al editar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {

    try {

      const result = await this.tipoPermisosService.remove(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al eliminar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }
  
}
