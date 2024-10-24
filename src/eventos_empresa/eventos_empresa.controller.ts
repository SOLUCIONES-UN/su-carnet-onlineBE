import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EventosEmpresaService } from './eventos_empresa.service';
import { CreateEventosEmpresaDto } from './dto/create-eventos_empresa.dto';
import { UpdateEventosEmpresaDto } from './dto/update-eventos_empresa.dto';

@Controller('eventos-empresa')
export class EventosEmpresaController {
  constructor(private readonly eventosEmpresaService: EventosEmpresaService) {}

  @Post()
  create(@Body() createEventosEmpresaDto: CreateEventosEmpresaDto) {
    return this.eventosEmpresaService.create(createEventosEmpresaDto);
  }

  @Get()
  findAll() {
    return this.eventosEmpresaService.findAll();
  }

  @Get(':idEmpresa')
  findOne(@Param('idEmpresa') idEmpresa: string) {
    return this.eventosEmpresaService.findAllByEmpresa(+idEmpresa);
  }

  @Get('/obtenerRespuestasEvento/:idEvento')
  obtenerRespuestasEvento(@Param('idEvento') idEvento: string) {
    return this.eventosEmpresaService.obtenerRespuestasEvento(+idEvento);
  }

  @Get('/eventos-empresas-afiliadas/:idUsuario')
  getEventosEmpresasAfiliadas(@Param('idUsuario') idUsuario: string) {
    return this.eventosEmpresaService.getEventosEmpresasAfiliadas(+idUsuario);
  }

  @Get('/reporte-participaciones/:idEvento')
  getReporteParticipaciones(@Param('idEvento') idEvento: string) {
    return this.eventosEmpresaService.getReporteParticipantesEvento(+idEvento);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEventosEmpresaDto: UpdateEventosEmpresaDto,
  ) {
    return this.eventosEmpresaService.update(+id, updateEventosEmpresaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventosEmpresaService.remove(+id);
  }
}
