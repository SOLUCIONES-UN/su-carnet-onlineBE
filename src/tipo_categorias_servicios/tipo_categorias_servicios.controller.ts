import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query } from '@nestjs/common';
import { TipoCategoriasServiciosService } from './tipo_categorias_servicios.service';
import { CreateTipoCategoriasServicioDto } from './dto/create-tipo_categorias_servicio.dto';
import { UpdateTipoCategoriasServicioDto } from './dto/update-tipo_categorias_servicio.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('tipo-categorias-servicios')
export class TipoCategoriasServiciosController {
  constructor(private readonly tipoCategoriasServiciosService: TipoCategoriasServiciosService) {}

  @Post()
  async create(@Body() createTipoCategoriasServicioDto: CreateTipoCategoriasServicioDto) {
   
    try {
      
      const result = await this.tipoCategoriasServiciosService.create(createTipoCategoriasServicioDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al agregar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    
    try {

      const result = await this.tipoCategoriasServiciosService.findAll(paginationDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Get(':id')
  async findOne(@Param('id') id: string) {

    try {

      const result = await this.tipoCategoriasServiciosService.findOne(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTipoCategoriasServicioDto: UpdateTipoCategoriasServicioDto) {
    
    try {

      const result = await this.tipoCategoriasServiciosService.update(+id, updateTipoCategoriasServicioDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al editar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    
    try {

      const result = await this.tipoCategoriasServiciosService.remove(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al eliminar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }
}
