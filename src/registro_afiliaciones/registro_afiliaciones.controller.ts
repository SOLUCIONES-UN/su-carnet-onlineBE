import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { RegistroAfiliacionesService } from './registro_afiliaciones.service';
import { CreateRegistroAfiliacioneDto } from './dto/create-registro_afiliacione.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('registro-afiliaciones')
export class RegistroAfiliacionesController {
  constructor(private readonly registroAfiliacionesService: RegistroAfiliacionesService) {}

  @Post()
  async create(@Body() createRegistroAfiliacioneDto: CreateRegistroAfiliacioneDto) {
   
    try {

      const result = await this.registroAfiliacionesService.create(createRegistroAfiliacioneDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al agregar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {

    try {

      const result = await this.registroAfiliacionesService.findAll(paginationDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {

    try {

      const result = await this.registroAfiliacionesService.remove(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al eliminar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }
}
