import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { TarjetaPresentacionService } from './tarjeta_presentacion.service';
import { CreateTarjetaPresentacionDto } from './dto/create-tarjeta_presentacion.dto';
import { UpdateTarjetaPresentacionDto } from './dto/update-tarjeta_presentacion.dto';

@Controller('tarjeta-presentacion')
export class TarjetaPresentacionController {
  constructor(private readonly tarjetaPresentacionService: TarjetaPresentacionService) {}

  @Post()
  async create(@Body() createTarjetaPresentacionDto: CreateTarjetaPresentacionDto) {
    return await this.tarjetaPresentacionService.create(createTarjetaPresentacionDto);
  }

  @Get()
  async findAll() {
    return await this.tarjetaPresentacionService.findAll();
  }

  @Get('findAllByUser/:id_usuario')
  async findAllByUser(@Param('id_usuario') id_usuario: number) {
    return await this.tarjetaPresentacionService.findAllByUsers(id_usuario);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.tarjetaPresentacionService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTarjetaPresentacionDto: UpdateTarjetaPresentacionDto) {
    return await this.tarjetaPresentacionService.update(+id, updateTarjetaPresentacionDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.tarjetaPresentacionService.remove(+id);
  }
  
}
