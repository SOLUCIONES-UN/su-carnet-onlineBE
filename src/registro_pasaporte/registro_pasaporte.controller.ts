import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { RegistroPasaporteService } from './registro_pasaporte.service';
import { CreateRegistroPasaporteDto } from './dto/create-registro_pasaporte.dto';
import { UpdateRegistroPasaporteDto } from './dto/update-registro_pasaporte.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';


@Controller('registro-pasaporte')
export class RegistroPasaporteController {
  constructor(private readonly registroPasaporteService: RegistroPasaporteService) {}

  @Post()
  async create(@Body() createRegistroPasaporteDto: CreateRegistroPasaporteDto) {
    
    try {

      const result = await this.registroPasaporteService.create(createRegistroPasaporteDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al agregar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {

    try {

      const result = await this.registroPasaporteService.findAll(paginationDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  @Get(':id')
  async findOne(@Param('id') id: string) {

    try {

      const result = await this.registroPasaporteService.findOne(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRegistroPasaporteDto: UpdateRegistroPasaporteDto) {
    
    try {

      const result = await this.registroPasaporteService.update(+id, updateRegistroPasaporteDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al editar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {

    try {

      const result = await this.registroPasaporteService.remove(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al eliminar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
}
