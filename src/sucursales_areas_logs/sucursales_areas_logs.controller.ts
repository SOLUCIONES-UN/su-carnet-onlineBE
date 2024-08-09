import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { SucursalesAreasLogsService } from './sucursales_areas_logs.service';
import { CreateSucursalesAreasLogDto } from './dto/create-sucursales_areas_log.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { UpdateSucursalesAreasLogDto } from './dto/update-sucursales_areas_log.dto';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { CreateNotificacioneDto } from '../notificaciones/dto/create-notificacione.dto';
import { SucursalesAreasPermisosService } from '../sucursales_areas_permisos/sucursales_areas_permisos.service';

@Controller('sucursales-areas-logs')
export class SucursalesAreasLogsController {
  constructor(private readonly sucursalesAreasLogsService: SucursalesAreasLogsService,
    private readonly notificacionesService: NotificacionesService,
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

      const consulta = this.sucursalesAreasLogsService.consultarLog(id);

      if((await consulta).estado == 'RECH' || (await consulta).estado == 'APL') 
      return new GenericResponse('401', 'QR vencido ya fue utilizado anteriormente ', consulta);

      const result = await this.sucursalesAreasLogsService.update(+id, updateSucursalesAreasLogDto);
  
      const tokenObtenido = await this.sucursalesAreasLogsService.obtenerToken(updateSucursalesAreasLogDto.idUsuario);
  
      if (result.estado === "APL") {

        tokenObtenido.forEach(async element => {
          const createNotificacioneDto: CreateNotificacioneDto = {
            token: element.tokendispositivo,
            payload: {
              notification: {
                title: 'Confirmacion de Cita',
                body: 'Acceso confirmado puede continuar' 
              },
              data: {
                customDataKey: 'customDataValue'
              }
            }
          };
    
          await this.notificacionesService.sendNotification(createNotificacioneDto);
        });

      } else if (result.estado === "RECH") {
        tokenObtenido.forEach(async element => {

          console.log(element.tokendispositivo);

          const createNotificacioneDto: CreateNotificacioneDto = {
            token: element.tokendispositivo,
            payload: {
              notification: {
                title: 'Confirmacion de Cita',
                body: 'Acceso denegado cita rechazada ' 
              },
              data: {
                customDataKey: 'customDataValue'
              }
            }
          };
          
          await this.notificacionesService.sendNotification(createNotificacioneDto);
        });
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

  @Get('visitasEnProceso')
  async visitasEnProceso() {

    try {
      const result = await this.sucursalesAreasLogsService.visitasEnProceso();
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('verificarCita/:idLogCita/:idUsuario')
  async verificarCita(@Param('idLogCita') idLogCita: number, idUsuario: number) {
    return await this.sucursalesAreasLogsService.verificarCita(idLogCita, idUsuario);
  }

}
