import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { CaracteristicasSucursalesService } from './caracteristicas_sucursales.service';
import { CreateCaracteristicasSucursaleDto } from './dto/create-caracteristicas_sucursale.dto';
import { UpdateCaracteristicasSucursaleDto } from './dto/update-caracteristicas_sucursale.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('caracteristicas-sucursales')
export class CaracteristicasSucursalesController {
  constructor(private readonly caracteristicasSucursalesService: CaracteristicasSucursalesService) {}

  @Post()
  async create(@Body() createCaracteristicasSucursaleDto: CreateCaracteristicasSucursaleDto) {
    
    try {
      
      const result = await this.caracteristicasSucursalesService.create(createCaracteristicasSucursaleDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al agregar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    
    try {

      const result = await this.caracteristicasSucursalesService.findAll(paginationDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Get(':id')
  async findOne(@Param('id') id: string) {

    try {

      const result = await this.caracteristicasSucursalesService.findOne(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCaracteristicasSucursaleDto: UpdateCaracteristicasSucursaleDto) {

    try {

      const result = await this.caracteristicasSucursalesService.update(+id, updateCaracteristicasSucursaleDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al editar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {

    try {

      const result = await this.caracteristicasSucursalesService.remove(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al eliminar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
