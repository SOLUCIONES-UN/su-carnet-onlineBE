import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ParticipacionUsuariosService } from './participacion-usuarios.service';
import { CreateParticipacionUsuarioDto } from './dto/create-participacion-usuario.dto';
import { UpdateParticipacionUsuarioDto } from './dto/update-participacion-usuario.dto';
import { ResponseFormDto } from './dto/response-form-dto';

@Controller('participacion-usuarios')
export class ParticipacionUsuariosController {
  constructor(
    private readonly participacionUsuariosService: ParticipacionUsuariosService,
  ) {}

  @Post()
  create(@Body() createParticipacionUsuarioDto: CreateParticipacionUsuarioDto) {
    return this.participacionUsuariosService.create(
      createParticipacionUsuarioDto,
    );
  }

  @Post('/formulario')
  responseForm(@Body() responseFormDTO: ResponseFormDto) {
    return this.participacionUsuariosService.responseForm(responseFormDTO);
  }

  @Get(':idEvento')
  findAll(@Param('idEvento') idEvento: string) {
    return this.participacionUsuariosService.findAllByEvento(+idEvento);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.participacionUsuariosService.findOne(+id);
  }

  @Patch(':idParticipacion')
  update(
    @Param('idParticipacion') idParticipacion: string,
    @Body() updateParticipacionUsuarioDto: UpdateParticipacionUsuarioDto,
  ) {
    return this.participacionUsuariosService.update(
      +idParticipacion,
      updateParticipacionUsuarioDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.participacionUsuariosService.remove(+id);
  }
}
