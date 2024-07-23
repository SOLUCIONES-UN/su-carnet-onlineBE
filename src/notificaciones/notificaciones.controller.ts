import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { CreateNotificacioneDto } from './dto/create-notificacione.dto';

@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  @Post('send')
  async sendNotification(@Body() createNotificacioneDto: CreateNotificacioneDto) {
    return this.notificacionesService.sendNotification(createNotificacioneDto);
  }
}
