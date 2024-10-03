import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { CreateNotificacioneDto } from './dto/create-notificacione.dto';
import { updateStateDto } from './dto/updateState.dto';

@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  @Post('send')
  async sendNotification(@Body() createNotificacioneDto: CreateNotificacioneDto) {
    return this.notificacionesService.sendNotification(createNotificacioneDto);
  }

  @Get(':idUsuario')
  GetByUsuario(@Param('idUsuario') idUsuario: number) {
    return this.notificacionesService.GetByUsuario(idUsuario);
  }

  @Patch()
  update(@Body() updateState: updateStateDto) {
    return this.notificacionesService.updateState(updateState);
  }
}
