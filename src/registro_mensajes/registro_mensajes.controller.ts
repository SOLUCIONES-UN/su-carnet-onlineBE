import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query } from '@nestjs/common';
import { RegistroMensajesService } from './registro_mensajes.service';
import { CreateRegistroMensajeDto } from './dto/create-registro_mensaje.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('registro-mensajes')
export class RegistroMensajesController {
  constructor(private readonly registroMensajesService: RegistroMensajesService) {}

  @Post()
  async create(@Body() createRegistroMensajeDto: CreateRegistroMensajeDto) {
    
    try {

      const result = await this.registroMensajesService.create(createRegistroMensajeDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al agregar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {

    try {

      const result = await this.registroMensajesService.findAll(paginationDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  
}
