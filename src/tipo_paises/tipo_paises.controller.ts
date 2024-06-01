import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { TipoPaisesService } from './tipo_paises.service';
import { CreateTipoPaiseDto } from './dto/create-tipo_paise.dto';
import { UpdateTipoPaiseDto } from './dto/update-tipo_paise.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('tipo-paises')
export class TipoPaisesController {
  constructor(private readonly tipoPaisesService: TipoPaisesService) {}

  @Post()
  async create(@Body() createTipoPaiseDto: CreateTipoPaiseDto) {
    
    try {
      
      const result = await this.tipoPaisesService.create(createTipoPaiseDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al agregar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    
    try {

      const result = await this.tipoPaisesService.findAll(paginationDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Get(':id')
  async findOne(@Param('id') id: string) {

    try {

      const result = await this.tipoPaisesService.findOne(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTipoPaiseDto: UpdateTipoPaiseDto) {
    
    try {

      const result = await this.tipoPaisesService.update(+id, updateTipoPaiseDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al editar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {

    try {

      const result = await this.tipoPaisesService.remove(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al eliminar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }
  
}
