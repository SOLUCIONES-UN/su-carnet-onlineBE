import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TiposCuentasService } from './tipos_cuentas.service';
import { CreateTiposCuentaDto } from './dto/create-tipos_cuenta.dto';
import { UpdateTiposCuentaDto } from './dto/update-tipos_cuenta.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('tipos-cuentas')
export class TiposCuentasController {
  constructor(private readonly tiposCuentasService: TiposCuentasService) {}

  @Post()
  create(@Body() createTiposCuentaDto: CreateTiposCuentaDto) {
    return this.tiposCuentasService.create(createTiposCuentaDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.tiposCuentasService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tiposCuentasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTiposCuentaDto: UpdateTiposCuentaDto) {
    return this.tiposCuentasService.update(+id, updateTiposCuentaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tiposCuentasService.remove(+id);
  }
}
