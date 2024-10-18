import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParticipacionUsuariosService } from './participacion-usuarios.service';
import { CreateParticipacionUsuarioDto } from './dto/create-participacion-usuario.dto';
import { UpdateParticipacionUsuarioDto } from './dto/update-participacion-usuario.dto';

@Controller('participacion-usuarios')
export class ParticipacionUsuariosController {
  constructor(private readonly participacionUsuariosService: ParticipacionUsuariosService) {}

  @Post()
  create(@Body() createParticipacionUsuarioDto: CreateParticipacionUsuarioDto) {
    return this.participacionUsuariosService.create(createParticipacionUsuarioDto);
  }

  @Get()
  findAll() {
    return this.participacionUsuariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.participacionUsuariosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParticipacionUsuarioDto: UpdateParticipacionUsuarioDto) {
    return this.participacionUsuariosService.update(+id, updateParticipacionUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.participacionUsuariosService.remove(+id);
  }
}
