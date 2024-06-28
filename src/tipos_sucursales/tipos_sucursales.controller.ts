import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { TiposSucursalesService } from './tipos_sucursales.service';
import { CreateTiposSucursaleDto } from './dto/create-tipos_sucursale.dto';
import { UpdateTiposSucursaleDto } from './dto/update-tipos_sucursale.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('tipos-sucursales')
export class TiposSucursalesController {
  constructor(private readonly tiposSucursalesService: TiposSucursalesService) {}

  @Post()
  async create(@Body() createTiposSucursaleDto: CreateTiposSucursaleDto) {
    
    try {
      
      const result = await this.tiposSucursalesService.create(createTiposSucursaleDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al agregar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    
    try {

      const result = await this.tiposSucursalesService.findAll(paginationDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {

    try {

      const result = await this.tiposSucursalesService.findOne(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTiposSucursaleDto: UpdateTiposSucursaleDto) {
    
    try {

      const result = await this.tiposSucursalesService.update(+id, updateTiposSucursaleDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al editar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {

    try {

      const result = await this.tiposSucursalesService.remove(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al eliminar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
