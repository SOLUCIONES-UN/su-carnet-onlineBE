import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { SucursalesAreasGruposPuertasService } from './sucursales_areas_grupos_puertas.service';
import { CreateSucursalesAreasGruposPuertaDto } from './dto/create-sucursales_areas_grupos_puerta.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('sucursales-areas-grupos-puertas')
export class SucursalesAreasGruposPuertasController {
  constructor(private readonly sucursalesAreasGruposPuertasService: SucursalesAreasGruposPuertasService) {}

  @Post()
  async create(@Body() createSucursalesAreasGruposPuertaDto: CreateSucursalesAreasGruposPuertaDto) {
    
    return this.sucursalesAreasGruposPuertasService.create(createSucursalesAreasGruposPuertaDto);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {

    try {

      const result = await this.sucursalesAreasGruposPuertasService.findAll(paginationDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {

    try {

      const result = await this.sucursalesAreasGruposPuertasService.remove(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al eliminar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }
}
