import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { EmpresasMensajesService } from './empresas_mensajes.service';
import { CreateEmpresasMensajeDto } from './dto/create-empresas_mensaje.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { UpdateEmpresasMensajeDto } from './dto/update-empresas_mensaje.dto';

@Controller('empresas-mensajes')
export class EmpresasMensajesController {
  constructor(private readonly empresasMensajesService: EmpresasMensajesService) {}

  @Post()
  async create(@Body() createEmpresasMensajeDto: CreateEmpresasMensajeDto) {
    
    try {

      const result = await this.empresasMensajesService.create(createEmpresasMensajeDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al agregar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {

    try {

      const result = await this.empresasMensajesService.findAll(paginationDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('mensajesEmpresa/:idEmpresa')
  async mensajesEmpresa(@Param('idEmpresa') idEmpresa: number) {
    return this.empresasMensajesService.mensajesEmpresa(idEmpresa);
  }


  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEmpresasMensajeDto: UpdateEmpresasMensajeDto) {
    return await this.empresasMensajesService.update(+id, updateEmpresasMensajeDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {

    return await this.empresasMensajesService.remove(id);
  }

  
}
