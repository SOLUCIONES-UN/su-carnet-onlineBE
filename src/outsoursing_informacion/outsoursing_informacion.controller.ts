import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { OutsoursingInformacionService } from './outsoursing_informacion.service';
import { CreateOutsoursingInformacionDto } from './dto/create-outsoursing_informacion.dto';
import { UpdateOutsoursingInformacionDto } from './dto/update-outsoursing_informacion.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('outsoursing-informacion')
export class OutsoursingInformacionController {
  constructor(private readonly outsoursingInformacionService: OutsoursingInformacionService) {}

  @Post()
  async create(@Body() createOutsoursingInformacionDto: CreateOutsoursingInformacionDto) {
    
    try {

      const result = await this.outsoursingInformacionService.create(createOutsoursingInformacionDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al agregar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {

    try {

      const result = await this.outsoursingInformacionService.findAll(paginationDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOutsoursingInformacionDto: UpdateOutsoursingInformacionDto) {
    
    try {

      const result = await this.outsoursingInformacionService.update(+id, updateOutsoursingInformacionDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al editar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async cerrarRelacion(@Param('id', ParseIntPipe) id: number) {

    try {

      const result = await this.outsoursingInformacionService.cerrarRelacion(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al eliminar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
