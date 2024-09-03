import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { SucursalesAreasPuertasService } from './sucursales_areas_puertas.service';
import { CreateSucursalesAreasPuertaDto } from './dto/create-sucursales_areas_puerta.dto';
import { UpdateSucursalesAreasPuertaDto } from './dto/update-sucursales_areas_puerta.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';

@Controller('sucursales-areas-puertas')
export class SucursalesAreasPuertasController {
  constructor(private readonly sucursalesAreasPuertasService: SucursalesAreasPuertasService) {}

  @Post()
  async create(@Body() createSucursalesAreasPuertaDto: CreateSucursalesAreasPuertaDto) {
    
    try {

      const result = await this.sucursalesAreasPuertasService.create(createSucursalesAreasPuertaDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al agregar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {

    try {

      const result = await this.sucursalesAreasPuertasService.findAll(paginationDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('findAllByArea/:idArea')
  async findAllByArea(@Param('idArea') idArea: number) {

    return await this.sucursalesAreasPuertasService.findAllByArea(idArea);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {

    try {

      const result = await this.sucursalesAreasPuertasService.findOne(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSucursalesAreasPuertaDto: UpdateSucursalesAreasPuertaDto) {
    
    try {

      const result = await this.sucursalesAreasPuertasService.update(+id, updateSucursalesAreasPuertaDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al editar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {

    try {

      const result = await this.sucursalesAreasPuertasService.remove(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al eliminar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

}
