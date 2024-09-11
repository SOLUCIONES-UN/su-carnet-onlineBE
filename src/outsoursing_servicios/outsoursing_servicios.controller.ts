import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { OutsoursingServiciosService } from './outsoursing_servicios.service';
import { CreateOutsoursingServicioDto } from './dto/create-outsoursing_servicio.dto';

@Controller('outsoursing-servicios')
export class OutsoursingServiciosController {
  constructor(private readonly outsoursingServiciosService: OutsoursingServiciosService) {}

  @Post()
  async create(@Body() createOutsoursingServicioDto: CreateOutsoursingServicioDto) {
    return await this.outsoursingServiciosService.create(createOutsoursingServicioDto);
  }

  @Get()
  async findAll() {
    return await this.outsoursingServiciosService.findAll();
  }

  @Get(':idOutsoursingInformacion')
  async findAllByOutsoursingInformacion(@Param('idOutsoursingInformacion', ParseIntPipe) idOutsoursingInformacion: number) {
    return await this.outsoursingServiciosService.findAllByOutsoursingInformacion(idOutsoursingInformacion);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.outsoursingServiciosService.remove(+id);
  }
  
}
