import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { RegistroDispositivosService } from './registro_dispositivos.service';
import { CreateRegistroDispositivoDto } from './dto/create-registro_dispositivo.dto';

@Controller('registro-dispositivos')
export class RegistroDispositivosController {
  constructor(private readonly registroDispositivosService: RegistroDispositivosService) {}

  @Post()
  async create(@Body() createRegistroDispositivoDto: CreateRegistroDispositivoDto) {
    return await this.registroDispositivosService.create(createRegistroDispositivoDto);
  }

  @Get()
  async findAll() {
    return await this.registroDispositivosService.findAll();
  }

  @Get(':idUsuario')
  async findAllByUsuario(@Param('idUsuario') idUsuario: number) {
    return await this.registroDispositivosService.findAllByUser(idUsuario);
  }

  @Patch(':id')
  async DispositivoEnvio(@Param('id') id: string) {
    return await this.registroDispositivosService.DispositivoEnvio(+id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.registroDispositivosService.remove(+id);
  }

}
