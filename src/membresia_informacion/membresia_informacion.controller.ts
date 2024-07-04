import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { MembresiaInformacionService } from './membresia_informacion.service';
import { CreateMembresiaInformacionDto } from './dto/create-membresia_informacion.dto';
import { UpdateMembresiaInformacionDto } from './dto/update-membresia_informacion.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('membresia-informacion')
export class MembresiaInformacionController {
  constructor(private readonly membresiaInformacionService: MembresiaInformacionService) {}

  @Post()
  async create(@Body() createMembresiaInformacionDto: CreateMembresiaInformacionDto) {
    
    try {

      const result = await this.membresiaInformacionService.create(createMembresiaInformacionDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al agregar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {

    try {

      const result = await this.membresiaInformacionService.findAll(paginationDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {

    try {

      const result = await this.membresiaInformacionService.findOne(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMembresiaInformacionDto: UpdateMembresiaInformacionDto) {
    
    try {

      const result = await this.membresiaInformacionService.update(+id, updateMembresiaInformacionDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al editar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {

    try {

      const result = await this.membresiaInformacionService.remove(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al eliminar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
}
