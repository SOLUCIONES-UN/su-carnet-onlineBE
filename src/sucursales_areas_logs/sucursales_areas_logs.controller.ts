import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { SucursalesAreasLogsService } from './sucursales_areas_logs.service';
import { CreateSucursalesAreasLogDto } from './dto/create-sucursales_areas_log.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';

@Controller('sucursales-areas-logs')
export class SucursalesAreasLogsController {
  constructor(private readonly sucursalesAreasLogsService: SucursalesAreasLogsService) {}

  @Post()
  async create(@Body() createSucursalesAreasLogDto: CreateSucursalesAreasLogDto) {
   
    try {

      const result = await this.sucursalesAreasLogsService.create(createSucursalesAreasLogDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al agregar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
