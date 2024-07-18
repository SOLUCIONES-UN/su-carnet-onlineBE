import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { EmpresasInformacionService } from './empresas_informacion.service';
import { CreateEmpresasInformacionDto } from './dto/create-empresas_informacion.dto';
import { UpdateEmpresasInformacionDto } from './dto/update-empresas_informacion.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { getEmpresasInformacion } from './dto/get-empresas_informacion.dto';

@Controller('empresas-informacion')
export class EmpresasInformacionController {
  constructor(private readonly empresasInformacionService: EmpresasInformacionService) {}

  @Post()
  async create(@Body() createEmpresasInformacionDto: CreateEmpresasInformacionDto) {

    try {

      const empresa = await this.empresasInformacionService.empresaByCode(createEmpresasInformacionDto.codigoEmpresa);

      if(empresa){
        return new GenericResponse('401', 'El codigo de empresa ya existe debe ingresar el codigo correcto', null);
      }

      const result = await this.empresasInformacionService.create(createEmpresasInformacionDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al agregar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {

    try {

      const result = await this.empresasInformacionService.findAll(paginationDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Get('findAllUser/:idUsuario')
  async findAllUser(@Param('idUsuario') idUsuario: number) {

    try {

      const result = await this.empresasInformacionService.findAllUser(idUsuario);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('GetRecientes')
  async GetRecientes() {

    try {

      const result = await this.empresasInformacionService.GetRecientes();
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('comerciosFrecuentes')
  async comerciosFrecuentes() {

    try {

      const result = await this.empresasInformacionService.comerciosFrecuentes();
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  @Get(':id')
  async findOne(@Param('id') id: string) {

    try {

      const result = await this.empresasInformacionService.findOne(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('empresa-disclaimer')
  async GetEmpresaByDisclaimer(@Body() getEmpresasInformacion: getEmpresasInformacion) {

    try {

      const result = await this.empresasInformacionService.GetEmpresaByDisclaimer(getEmpresasInformacion.disclaimer);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Patch(':id')
  async update(@Param('id') id: string, @Body() UpdateEmpresasInformacionDto: UpdateEmpresasInformacionDto) {
    
    try {

      const result = await this.empresasInformacionService.update(+id, UpdateEmpresasInformacionDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al editar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {

    try {

      const result = await this.empresasInformacionService.remove(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al eliminar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }
}
