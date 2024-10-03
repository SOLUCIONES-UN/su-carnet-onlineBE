import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query } from '@nestjs/common';
import { TipoServiciosService } from './tipo_servicios.service';
import { CreateTipoServicioDto } from './dto/create-tipo_servicio.dto';
import { UpdateTipoServicioDto } from './dto/update-tipo_servicio.dto';

@Controller('tipo-servicios')
export class TipoServiciosController {
  constructor(private readonly tipoServiciosService: TipoServiciosService) {}

  @Post()
  async create(@Body() createTipoServicioDto: CreateTipoServicioDto) {
    
    return await this.tipoServiciosService.create(createTipoServicioDto);
  }

  @Get()
  async findAll() {
    return await this.tipoServiciosService.findAll();
  }

  @Get('finAllByEmpresa/:idEmpresa')
  async finAllByEmpresa(@Param('idEmpresa') idEmpresa: number) {

    return await this.tipoServiciosService.findAllByEmpresa(idEmpresa);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {

    return await this.tipoServiciosService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTipoServicioDto: UpdateTipoServicioDto) {
    
    return await this.tipoServiciosService.update(+id, updateTipoServicioDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    
    return await this.tipoServiciosService.remove(+id);

  }

}
