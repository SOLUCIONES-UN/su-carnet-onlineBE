import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query } from '@nestjs/common';
import { RegistroDispositivosService } from './registro_dispositivos.service';
import { CreateRegistroDispositivoDto } from './dto/create-registro_dispositivo.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('registro-dispositivos')
export class RegistroDispositivosController {
  constructor(private readonly registroDispositivosService: RegistroDispositivosService) {}

  @Post()
  async create(@Body() createRegistroDispositivoDto: CreateRegistroDispositivoDto) {
    
    try {

      const result = await this.registroDispositivosService.create(createRegistroDispositivoDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al agregar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll() {

    try {

      const result = await this.registroDispositivosService.findAll();
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':idUsuario')
  async findAllByUsuario(@Param('idUsuario') idUsuario: number) {

    try {

      const result = await this.registroDispositivosService.findAllByUser(idUsuario);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async DispositivoEnvio(@Param('id') id: string) {

    try {

      const result = await this.registroDispositivosService.DispositivoEnvio(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al eliminar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
