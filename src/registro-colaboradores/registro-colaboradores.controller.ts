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

  @Get()
  findAll() {
    return this.registroColaboradoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.registroColaboradoresService.findOne(+id);
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
