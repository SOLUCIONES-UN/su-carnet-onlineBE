import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { SucursalesAreasInformacionService } from './sucursales_areas_informacion.service';
import { CreateSucursalesAreasInformacionDto } from './dto/create-sucursales_areas_informacion.dto';
import { UpdateSucursalesAreasInformacionDto } from './dto/update-sucursales_areas_informacion.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('sucursales-areas-informacion')
export class SucursalesAreasInformacionController {
  constructor(private readonly sucursalesAreasInformacionService: SucursalesAreasInformacionService) {}

  @Post()
  async create(@Body() createSucursalesAreasInformacionDto: CreateSucursalesAreasInformacionDto) {
    
    try {

      const result = await this.sucursalesAreasInformacionService.create(createSucursalesAreasInformacionDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al agregar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {

    try {

      const result = await this.sucursalesAreasInformacionService.findAll(paginationDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('SucursalesAreasInformacion/:idSucursal')
  async findAllBySucursal(@Param('idSucursal') idSucursal:string) {

    try {

      const result = await this.sucursalesAreasInformacionService.findAllBySucursalId(+idSucursal);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {

    try {

      const result = await this.sucursalesAreasInformacionService.findOne(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSucursalesAreasInformacionDto: UpdateSucursalesAreasInformacionDto) {
    
    try {

      const result = await this.sucursalesAreasInformacionService.update(+id, updateSucursalesAreasInformacionDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al editar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {

    try {

      const result = await this.sucursalesAreasInformacionService.remove(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al eliminar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }
  
}
