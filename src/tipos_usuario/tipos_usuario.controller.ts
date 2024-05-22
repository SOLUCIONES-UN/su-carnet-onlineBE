import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { TiposUsuarioService } from './tipos_usuario.service';
import { CreateTiposUsuarioDto } from './dto/create-tipos_usuario.dto';
import { UpdateTiposUsuarioDto } from './dto/update-tipos_usuario.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('tipos-usuario')
export class TiposUsuarioController {
  constructor(private readonly tiposUsuarioService: TiposUsuarioService) {}

  @Post()
  create(@Body() createTiposUsuarioDto: CreateTiposUsuarioDto) {
    return this.tiposUsuarioService.create(createTiposUsuarioDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.tiposUsuarioService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tiposUsuarioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTiposUsuarioDto: UpdateTiposUsuarioDto) {
    return this.tiposUsuarioService.update(+id, updateTiposUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tiposUsuarioService.remove(+id);
  }
}
