import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query } from '@nestjs/common';
import { TipoServiciosService } from './tipo_servicios.service';
import { CreateTipoServicioDto } from './dto/create-tipo_servicio.dto';
import { UpdateTipoServicioDto } from './dto/update-tipo_servicio.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('tipo-servicios')
export class TipoServiciosController {
  constructor(private readonly tipoServiciosService: TipoServiciosService) {}

  @Post()
  async create(@Body() createTipoServicioDto: CreateTipoServicioDto) {
    
    try {
      
      const result = await this.tipoServiciosService.create(createTipoServicioDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al agregar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    
    try {

      const result = await this.tipoServiciosService.findAll(paginationDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Get(':id')
  async findOne(@Param('id') id: string) {

    try {

      const result = await this.tipoServiciosService.findOne(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTipoServicioDto: UpdateTipoServicioDto) {
    
    try {

      const result = await this.tipoServiciosService.update(+id, updateTipoServicioDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al editar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    
    try {

      const result = await this.tipoServiciosService.remove(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al eliminar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

}
