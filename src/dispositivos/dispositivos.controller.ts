import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DispositivosService } from './dispositivos.service';
import { CreateDispositivoDto } from './dto/create-dispositivo.dto';

@Controller('dispositivos')
export class DispositivosController {
  constructor(private readonly dispositivosService: DispositivosService) {}

  @Post()
  create(@Body() createDispositivoDto: CreateDispositivoDto) {
    return this.dispositivosService.create(createDispositivoDto);
  }

  @Delete(':idusuario')
  remove(@Param('idusuario') idusuario: string) {
    return this.dispositivosService.remove(+idusuario);
  }
}
