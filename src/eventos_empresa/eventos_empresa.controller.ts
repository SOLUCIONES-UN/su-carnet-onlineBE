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
