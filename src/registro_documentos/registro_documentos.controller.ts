import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { RegistroDocumentosService } from './registro_documentos.service';
import { CreateRegistroDocumentoDto } from './dto/create-registro_documento.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { verificPerson } from './dto/verifica_persona.dto';

@Controller('registro-documentos')
export class RegistroDocumentosController {
  constructor(private readonly registroDocumentosService: RegistroDocumentosService) { }

  //endpoint para verificacion de persona por reconocimeinto facil 
  @Post('verificPerson')
  async verificPerson(@Body() verificPerson: verificPerson) {
    try {
      const { foto_dpi, user } = verificPerson;

      let usuario = await this.registroDocumentosService.getUsuario(user);

      if(!usuario)  return new GenericResponse('400', 'Usuario no existe', usuario);

      const isMatch = await this.registroDocumentosService.compareFaces(foto_dpi, usuario.fotoPerfil);

      if(isMatch == false) return new GenericResponse('406', 'No aceptable', isMatch);

      return new GenericResponse('200', 'EXITO', isMatch);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al verificar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async create(@Body() createRegistroDocumentoDto: CreateRegistroDocumentoDto) {

    try {

      const result = await this.registroDocumentosService.create(createRegistroDocumentoDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al agregar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {

    try {

      const result = await this.registroDocumentosService.findAll(paginationDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Get('documentoByUsuario/:idUsuario')
  async findAllByRegistro(@Param('idUsuario') idUsuario: number) {

    try {

      const result = await this.registroDocumentosService.findAllByRegistro(+idUsuario);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('registrarDocumentoInicialFoto/:usuario/:fotoInicial')
  async registrarDocumentoInicialFoto(@Param('usuario') usuario: string, @Param('fotoInicial') fotoInicial: string) {

    try {

      const result = await this.registroDocumentosService.registrarDocumentoInicialFoto(usuario, fotoInicial);

      if (result == false) {
        return new GenericResponse('400', 'Error al agergar foto de perfil', null);
      }

      return new GenericResponse('200', 'Éxito', 'foto perfil agregada con éxito');
    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al cargar documento inicial', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Patch(':id')
  async aceptarDocumento(@Param('id') id: string) {

    try {

      const result = await this.registroDocumentosService.acepatarDocumento(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al eliminar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {

    try {

      const result = await this.registroDocumentosService.remove(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al eliminar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }
}
