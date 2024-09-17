import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { RegistroAfiliacionesService } from './registro_afiliaciones.service';
import { CreateRegistroAfiliacioneDto } from './dto/create-registro_afiliacione.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { UpdateRegistroAfiliacioneDto } from './dto/update-registro_afiliacione.dto';

@Controller('registro-afiliaciones')
export class RegistroAfiliacionesController {
  constructor(private readonly registroAfiliacionesService: RegistroAfiliacionesService) {}

  @Post()
  async create(@Body() createRegistroAfiliacioneDto: CreateRegistroAfiliacioneDto) {
  
    return this.registroAfiliacionesService.create(createRegistroAfiliacioneDto);
  }

  @Patch('AceptarAfiliacion/:id')
  async update(@Param('id') id: string, @Body() updateRegistroAfiliacioneDto: UpdateRegistroAfiliacioneDto) {

    return await this.registroAfiliacionesService.AceptarAfiliacion(+id, updateRegistroAfiliacioneDto);
  }

  @Patch('desAfiliar/:id')
  async desAfiliar(@Param('id') id: number) {

    return await this.registroAfiliacionesService.desAfiliar(id);
  }


  @Get(':idEmpresa/:estado')
  async findAll(@Param('idEmpresa') idEmpresa: number, @Param('estado') estado: string) {

    return await this.registroAfiliacionesService.findAll(idEmpresa, estado);
  }

  @Get(':idEmpresa')
  async findAllByEmpresa(@Param('idEmpresa') idEmpresa: number) {

    return await this.registroAfiliacionesService.findAllByEmpresa(idEmpresa);
  }

  @Get('afiliacionVencida/:idEmpresa')
  async afiliacionVencida(@Param('idEmpresa') idEmpresa: number) {

    try {

      const result = await this.registroAfiliacionesService.afiliacionVencida(idEmpresa);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('findAllByUsuario/get/:idUsuario')
  async findAllByUsuario(@Param('idUsuario') idUsuario: number) {
    return await this.registroAfiliacionesService.afiliacionByUsuario(idUsuario);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.registroAfiliacionesService.remove(+id);
  }
  
}
