import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { TarjetaPresentacionService } from './tarjeta_presentacion.service';
import { CreateTarjetaPresentacionDto } from './dto/create-tarjeta_presentacion.dto';
import { UpdateTarjetaPresentacionDto } from './dto/update-tarjeta_presentacion.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('tarjeta-presentacion')
export class TarjetaPresentacionController {
  constructor(private readonly tarjetaPresentacionService: TarjetaPresentacionService) {}

  @Post()
  async create(@Body() createTarjetaPresentacionDto: CreateTarjetaPresentacionDto) {
    
    try {

      const result = await this.tarjetaPresentacionService.create(createTarjetaPresentacionDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al agregar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {

    try {

      const result = await this.tarjetaPresentacionService.findAll(paginationDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('findAllByUser/:id_usuario')
  async findAllByUser(@Param('id_usuario') id_usuario: number) {

    try {

      const result = await this.tarjetaPresentacionService.findAllByUsers(id_usuario);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {

    try {

      const result = await this.tarjetaPresentacionService.findOne(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTarjetaPresentacionDto: UpdateTarjetaPresentacionDto) {
    
    try {

      const result = await this.tarjetaPresentacionService.update(+id, updateTarjetaPresentacionDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al editar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {

    try {

      const result = await this.tarjetaPresentacionService.remove(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al eliminar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
}
