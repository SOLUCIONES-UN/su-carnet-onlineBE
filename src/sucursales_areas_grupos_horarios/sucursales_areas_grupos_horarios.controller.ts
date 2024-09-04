import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { SucursalesAreasGruposHorariosService } from './sucursales_areas_grupos_horarios.service';
import { CreateSucursalesAreasGruposHorarioDto } from './dto/create-sucursales_areas_grupos_horario.dto';
import { UpdateSucursalesAreasGruposHorarioDto } from './dto/update-sucursales_areas_grupos_horario.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { horarioFechasDto } from './dto/horarioFechasDto';

@Controller('sucursales-areas-grupos-horarios')
export class SucursalesAreasGruposHorariosController {
  constructor(private readonly sucursalesAreasGruposHorariosService: SucursalesAreasGruposHorariosService) {}

  @Post()
  async create(@Body() createSucursalesAreasGruposHorarioDto: CreateSucursalesAreasGruposHorarioDto) {
    return await this.sucursalesAreasGruposHorariosService.create(createSucursalesAreasGruposHorarioDto);
  }

  @Get()
  async findAll() {
    return await this.sucursalesAreasGruposHorariosService.findAll();
  }

  @Get('findAllByGrupo/:idGrupo')
  async findAllByGrupo(@Param('idGrupo') idGrupo:number) {
    await this.sucursalesAreasGruposHorariosService.findAllByGrupo(idGrupo);
  }


  @Post('HorariosCitas')
  async getHorariosByGrupo(@Body() horarioFechas: horarioFechasDto) {
    await this.sucursalesAreasGruposHorariosService.HorariosCitas(horarioFechas);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSucursalesAreasGruposHorarioDto: UpdateSucursalesAreasGruposHorarioDto) {
    return await this.sucursalesAreasGruposHorariosService.update(+id, updateSucursalesAreasGruposHorarioDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.sucursalesAreasGruposHorariosService.remove(+id);
  }

}
