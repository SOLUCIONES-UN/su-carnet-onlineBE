import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { RegistroAfiliacionesService } from './registro_afiliaciones.service';
import { CreateRegistroAfiliacioneDto } from './dto/create-registro_afiliacione.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { UpdateRegistroAfiliacioneDto } from './dto/update-registro_afiliacione.dto';

@Controller('registro-afiliaciones')
export class RegistroAfiliacionesController {
  constructor(private readonly registroAfiliacionesService: RegistroAfiliacionesService) {}

  @Post()
  async create(@Body() createRegistroAfiliacioneDto: CreateRegistroAfiliacioneDto) {
  
    return this.registroAfiliacionesService.create(createRegistroAfiliacioneDto);

  }

  @Patch('AceptarAfiliacion/:id')
  async update(@Param('id') id: string, @Body() updateRegistroAfiliacioneDto: UpdateRegistroAfiliacioneDto) {
    
    try {

      const result = await this.registroAfiliacionesService.AceptarAfiliacion(+id, updateRegistroAfiliacioneDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al editar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Get(':idEmpresa/:estado')
  async findAll(@Param('idEmpresa') idEmpresa: number, @Param('estado') estado: string) {

    try {

      const result = await this.registroAfiliacionesService.findAll(idEmpresa, estado);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':idEmpresa')
  async findAllByEmpresa(@Param('idEmpresa') idEmpresa: number) {

    try {

      const result = await this.registroAfiliacionesService.findAllByEmpresa(idEmpresa);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('afiliacionVencida/:idEmpresa')
  async afiliacionVencida(@Param('idEmpresa') idEmpresa: number) {

    try {

      const result = await this.registroAfiliacionesService.afiliacionVencida(idEmpresa);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':idUsuario')
  async afiliacionByUsuario(@Param('idUsuario') idUsuario: string) {
    try {

      const result = await this.registroAfiliacionesService.afiliacionByUsuario(+idUsuario);
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
