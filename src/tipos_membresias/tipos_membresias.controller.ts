import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query } from '@nestjs/common';
import { TiposMembresiasService } from './tipos_membresias.service';
import { CreateTiposMembresiaDto } from './dto/create-tipos_membresia.dto';
import { UpdateTiposMembresiaDto } from './dto/update-tipos_membresia.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('tipos-membresias')
export class TiposMembresiasController {
  constructor(private readonly tiposMembresiasService: TiposMembresiasService) {}

  @Post()
  async create(@Body() createTiposMembresiaDto: CreateTiposMembresiaDto) {
    
    try {
      
      const result = await this.tiposMembresiasService.create(createTiposMembresiaDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al agregar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    
    try {

      const result = await this.tiposMembresiasService.findAll(paginationDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Get(':id')
  async findOne(@Param('id') id: string) {

    try {

      const result = await this.tiposMembresiasService.findOne(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTiposMembresiaDto: UpdateTiposMembresiaDto) {
    
    try {

      const result = await this.tiposMembresiasService.update(+id, updateTiposMembresiaDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al editar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    
    try {

      const result = await this.tiposMembresiasService.remove(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al eliminar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

}
