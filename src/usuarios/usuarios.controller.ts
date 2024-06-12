import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus, Put } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { changePasswordDto } from './dto/changePasswordDto';
import { VerificacionUsuariosService } from '../verificacion_usuarios/verificacion_usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService,
    private readonly VerificacionUsuariosService: VerificacionUsuariosService) { }

  @Post()
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {

    try {

      const existeEmail = await this.usuariosService.existsEmail(createUsuarioDto.email);

      if (existeEmail) {
        return new GenericResponse('401', 'El correo ingresado ya esta siendo utilizado ', null);
      }

      const result = await this.usuariosService.create(createUsuarioDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al agregar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {

    try {

      const result = await this.usuariosService.findAll(paginationDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {

    try {

      const result = await this.usuariosService.findOne(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {

    try {

      const result = await this.usuariosService.update(+id, updateUsuarioDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al editar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('changePassword')
  async changePassword(@Body() changePasswordDto: changePasswordDto) {

    try {
      // Verificar si el email existe
      const user = await this.usuariosService.verifiUser(changePasswordDto.email);

      if (!user) {
        return new GenericResponse('400', 'El usuario no existe o no esta verificado', null);
      }

      // Cambiar la contraseña
      const result = await this.usuariosService.changePassword(changePasswordDto);

      if (!result) {
        return new GenericResponse('400', 'Error al cambiar la contraseña', null);
      }

      return new GenericResponse('200', 'Éxito', 'Contraseña cambiada con éxito');
    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al cambiar la contraseña', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {

    try {

      const result = await this.usuariosService.remove(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al eliminar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
