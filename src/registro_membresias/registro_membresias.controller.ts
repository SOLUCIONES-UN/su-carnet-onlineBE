import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { RegistroMembresiasService } from './registro_membresias.service';
import { CreateRegistroMembresiaDto } from './dto/create-registro_membresia.dto';
import { UpdateRegistroMembresiaDto } from './dto/update-registro_membresia.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';1
import { GenericResponse } from '../common/dtos/genericResponse.dto';

@Controller('registro-membresias')
export class RegistroMembresiasController {
  constructor(private readonly registroMembresiasService: RegistroMembresiasService) {}

  @Post()
  async create(@Body() createRegistroMembresiaDto: CreateRegistroMembresiaDto) {
    
    try {

      const result = await this.registroMembresiasService.create(createRegistroMembresiaDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al agregar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {

    try {

      const result = await this.registroMembresiasService.findAll(paginationDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {

    try {

      const result = await this.registroMembresiasService.findOne(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('membresiasUsuario/:idUsuario')
  async membresiasUsuario(@Param('idUsuario') idUsuario: number) {
    return this.registroMembresiasService.membresiasUsuario(idUsuario);
  }

  @Get('membresiasEmpresa/:idEmpresa')
  async membresiasEmpresa(@Param('idEmpresa') idEmpresa: number) {
    return await this.registroMembresiasService.membresiasEmpresas(idEmpresa);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRegistroMembresiaDto: UpdateRegistroMembresiaDto) {
    
    try {

      const result = await this.registroMembresiasService.update(+id, updateRegistroMembresiaDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al editar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {

    try {

      const result = await this.registroMembresiasService.remove(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al eliminar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
}
