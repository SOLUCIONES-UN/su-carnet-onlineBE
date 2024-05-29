import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { TiposUsuarioService } from './tipos_usuario.service';
import { CreateTiposUsuarioDto } from './dto/create-tipos_usuario.dto';
import { UpdateTiposUsuarioDto } from './dto/update-tipos_usuario.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';

@Controller('tipos-usuario')
export class TiposUsuarioController {
  constructor(private readonly tiposUsuarioService: TiposUsuarioService) { }

  @Post()
  async create(@Body() createTiposUsuarioDto: CreateTiposUsuarioDto) {

    try {

      const result = await this.tiposUsuarioService.create(createTiposUsuarioDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al agregar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {

    try {

      const result = await this.tiposUsuarioService.findAll(paginationDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('getNivelesAcceso')
  async getNivelesAcceso(@Query() paginationDto: PaginationDto) {

    try {

      const result = await this.tiposUsuarioService.getNivelesAcceso(paginationDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {

    try {

      const result = await this.tiposUsuarioService.findOne(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTiposUsuarioDto: UpdateTiposUsuarioDto) {
    
    try {

      const result = await this.tiposUsuarioService.update(+id, updateTiposUsuarioDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al editar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {

    try {

      const result = await this.tiposUsuarioService.remove(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al eliminar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }
}
