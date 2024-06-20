import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { SucursalesInformacionService } from './sucursales_informacion.service';
import { CreateSucursalesInformacionDto } from './dto/create-sucursales_informacion.dto';
import { UpdateSucursalesInformacionDto } from './dto/update-sucursales_informacion.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('sucursales-informacion')
export class SucursalesInformacionController {
  constructor(private readonly sucursalesInformacionService: SucursalesInformacionService) {}

  @Post()
  async create(@Body() createSucursalesInformacionDto: CreateSucursalesInformacionDto) {
    
    try {

      const result = await this.sucursalesInformacionService.create(createSucursalesInformacionDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al agregar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {

    try {

      const result = await this.sucursalesInformacionService.findAll(paginationDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('sucursalesConProgramacion/:idEmpresa')
  async sucursalesConProgramacion(@Param('idEmpresa') idEmpresa:string) {

    try {

      const result = await this.sucursalesInformacionService.sucursalesConProgramacion(+idEmpresa);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('sucursales/:idEmpresa')
  async findAllByEmpresaId(@Param('idEmpresa') idEmpresa:string) {

    try {

      const result = await this.sucursalesInformacionService.findAllByEmpresaId(+idEmpresa);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  

  @Get(':id')
  async findOne(@Param('id') id: string) {

    try {

      const result = await this.sucursalesInformacionService.findOne(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSucursalesInformacionDto: UpdateSucursalesInformacionDto) {
    
    try {

      const result = await this.sucursalesInformacionService.update(+id, updateSucursalesInformacionDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al editar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {

    try {

      const result = await this.sucursalesInformacionService.remove(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al eliminar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
}
