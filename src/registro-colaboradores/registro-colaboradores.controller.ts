import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RegistroColaboradoresService } from './registro-colaboradores.service';
import { CreateRegistroColaboradoreDto } from './dto/create-registro-colaboradore.dto';
import { UpdateRegistroColaboradoreDto } from './dto/update-registro-colaboradore.dto';

@Controller('registro-colaboradores')
export class RegistroColaboradoresController {
  constructor(private readonly registroColaboradoresService: RegistroColaboradoresService) {}

  @Post()
  create(@Body() createRegistroColaboradoreDto: CreateRegistroColaboradoreDto) {
    return this.registroColaboradoresService.create(createRegistroColaboradoreDto);
  }

  @Get(':idEmpresa/:estado')
  findAll(@Param('idEmpresa') idEmpresa: number, @Param('estado') estado: string) {
    return this.registroColaboradoresService.findAll(idEmpresa, estado);
  }

  @Get(':idUsuario')
  solicitudesPendientes(@Param('idUsuario') idUsuario: number) {
    return this.registroColaboradoresService.solicitudesUsuario(idUsuario);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegistroColaboradoreDto: UpdateRegistroColaboradoreDto) {
    return this.registroColaboradoresService.update(+id, updateRegistroColaboradoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.registroColaboradoresService.remove(+id);
  }
}
