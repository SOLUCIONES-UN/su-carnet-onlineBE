import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, Put } from '@nestjs/common';
import { OutsoursingAfiliacionesService } from './outsoursing_afiliaciones.service';
import { CreateOutsoursingAfiliacioneDto } from './dto/create-outsoursing_afiliacione.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('outsoursing-afiliaciones')
export class OutsoursingAfiliacionesController {
  constructor(private readonly outsoursingAfiliacionesService: OutsoursingAfiliacionesService) {}

  @Post()
  async create(@Body() createOutsoursingAfiliacioneDto: CreateOutsoursingAfiliacioneDto) {
    
    try {

      const result = await this.outsoursingAfiliacionesService.create(createOutsoursingAfiliacioneDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al agregar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {

    try {

      const result = await this.outsoursingAfiliacionesService.findAll(paginationDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('solicitud/:id')
  async solicitud(@Param('id') id: string) {

    try {

      const result = await this.outsoursingAfiliacionesService.solicitud(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al eliminar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('aceptacion/:id')
  async aceptacion(@Param('id') id: string) {
    
    try {

      const result = await this.outsoursingAfiliacionesService.aceptacion(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al eliminar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
