import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { SucursalesAreasLogsService } from './sucursales_areas_logs.service';
import { CreateSucursalesAreasLogDto } from './dto/create-sucursales_areas_log.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { UpdateSucursalesAreasLogDto } from './dto/update-sucursales_areas_log.dto';
import { NotificacionesService } from '../notificaciones/notificaciones.service';

@Controller('sucursales-areas-logs')
export class SucursalesAreasLogsController {
  constructor(private readonly sucursalesAreasLogsService: SucursalesAreasLogsService,
    // private readonly notificacionesService: NotificacionesService
  ) {}

  @Post('iniciarVisita')
  async create(@Body() createSucursalesAreasLogDto: CreateSucursalesAreasLogDto) {
   
    try {

      const result = await this.sucursalesAreasLogsService.create(createSucursalesAreasLogDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al agregar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateSucursalesAreasLogDto: UpdateSucursalesAreasLogDto) {
    
    try {

      const result = await this.sucursalesAreasLogsService.update(+id, updateSucursalesAreasLogDto);

      if(result.estado == "APL"){

      }

      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al editar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Get('enProceso/:idCita')
  async getCitasUsuario(@Param('idCita') idCita: number) {

    try {

      const result = await this.sucursalesAreasLogsService.enProceso(idCita);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('verificarCita/:idLogCita')
  async verificarCita(@Param('idLogCita') idLogCita: number) {
    return await this.sucursalesAreasLogsService.verificarCita(idLogCita);
  }

}
