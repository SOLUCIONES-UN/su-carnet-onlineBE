import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { TipoRelacionEmpresasService } from './tipo_relacion_empresas.service';
import { CreateTipoRelacionEmpresaDto } from './dto/create-tipo_relacion_empresa.dto';
import { UpdateTipoRelacionEmpresaDto } from './dto/update-tipo_relacion_empresa.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';

@Controller('tipo-relacion-empresas')
export class TipoRelacionEmpresasController {
  constructor(private readonly tipoRelacionEmpresasService: TipoRelacionEmpresasService) {}

  @Post()
  async create(@Body() createTipoRelacionEmpresaDto: CreateTipoRelacionEmpresaDto) {
    
    try {

      const result = await this.tipoRelacionEmpresasService.create(createTipoRelacionEmpresaDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al agregar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {

    try {

      const result = await this.tipoRelacionEmpresasService.findAll(paginationDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {

    try {

      const result = await this.tipoRelacionEmpresasService.findOne(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTipoRelacionEmpresaDto: UpdateTipoRelacionEmpresaDto) {
    
    try {

      const result = await this.tipoRelacionEmpresasService.update(+id, updateTipoRelacionEmpresaDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al editar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {

    try {

      const result = await this.tipoRelacionEmpresasService.remove(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al eliminar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
}
