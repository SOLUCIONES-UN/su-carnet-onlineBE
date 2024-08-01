import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { RegistroInformacionService } from './registro_informacion.service';
import { CreateRegistroInformacionDto } from './dto/create-registro_informacion.dto';
import { UpdateRegistroInformacionDto } from './dto/update-registro_informacion.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { UsuariosService } from '../usuarios/usuarios.service';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../usuarios/dto/update-usuario.dto';
import { updateUsuarioEmpresaDto } from '../usuarios/dto/update-usuario-empresa.dto';

@Controller('registro-informacion')
export class RegistroInformacionController {
  constructor(private readonly registroInformacionService: RegistroInformacionService,
    private readonly usuariosService: UsuariosService
  ) {}

  @Post()
  async create(@Body() createRegistroInformacionDto: CreateRegistroInformacionDto) {
    try {
      const registroInformacion = await this.registroInformacionService.existRegistro(createRegistroInformacionDto.documento);
  
      if (registroInformacion) {
        return new GenericResponse('401', 'Esta persona con DPI ', registroInformacion.documento + ' ya se ha registrado anteriormente ');
      }
  
      const existeEmail = await this.usuariosService.existsEmail(createRegistroInformacionDto.correo);
  
      if (existeEmail) {
        return new GenericResponse('401', 'El correo ingresado ya está siendo utilizado', null);
      }
  
      const existeTelefono = await this.usuariosService.existsPhoneNumber(createRegistroInformacionDto.telefono);
  
      if (existeTelefono) {
        return new GenericResponse('401', 'El teléfono ingresado ya está siendo utilizado', null);
      }
  
      let tipoUsuario;
  
      if (createRegistroInformacionDto.idTipo === undefined || createRegistroInformacionDto.idTipo === null) {
        tipoUsuario = await this.usuariosService.getTipoUsuario();
      } else {
        tipoUsuario = { id: createRegistroInformacionDto.idTipo };
      }
  
      let createUsuarioDto: CreateUsuarioDto = {
        nombres: createRegistroInformacionDto.nombres,
        apellidos: createRegistroInformacionDto.apellidos,
        email: createRegistroInformacionDto.correo,
        telefono: createRegistroInformacionDto.telefono,
        password: createRegistroInformacionDto.password,
        idEmpresas: createRegistroInformacionDto.idEmpresas,
        idSucursal: createRegistroInformacionDto.idSucursal,
        idAreaSucursal: createRegistroInformacionDto.idAreaSucursal,
        idTipo: tipoUsuario.id,
        fotoPerfil: ''
      };
  
      const usuario = await this.usuariosService.create(createUsuarioDto);
  
      if (!usuario) {
        return new GenericResponse('401', 'Error al crear el usuario', usuario);
      }
  
      const result = await this.registroInformacionService.create(createRegistroInformacionDto, usuario);
  
      if (!result) {
        return new GenericResponse('401', 'Error al registrar la información', result);
      }
      return new GenericResponse('200', 'ÉXITO', result);
  
    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al agregar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {

    try {

      const result = await this.registroInformacionService.findAll(paginationDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('findAllByEmpresa/:idEmpresa')
  async findAllByEmpresa(@Query() paginationDto: PaginationDto, @Param('idEmpresa') idEmpresa:number) {

    try {

      const result = await this.registroInformacionService.findAllByEmpresa(paginationDto, idEmpresa);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('findAllByUsuario/:idUsuario')
  async findAllByUsuario(@Param('idUsuario') idUsuario: number) {

    try {

      const result = await this.registroInformacionService.findAllByUsuario(idUsuario);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRegistroInformacionDto: UpdateRegistroInformacionDto) {
    
    try {

      const registroInformacion = await this.registroInformacionService.update(+id, updateRegistroInformacionDto);

      let tipoUsuario;
  
      if (updateRegistroInformacionDto.idTipo === undefined || updateRegistroInformacionDto.idTipo === null) {
        tipoUsuario = await this.usuariosService.getTipoUsuario();
      } else {
        tipoUsuario = await this.usuariosService.getTipoUsuarioById(updateRegistroInformacionDto.idTipo);
      }

      let updateUsuarioDto: updateUsuarioEmpresaDto = {
        nombres: updateRegistroInformacionDto.nombres,
        apellidos: updateRegistroInformacionDto.apellidos,
        email: updateRegistroInformacionDto.correo,
        telefono: updateRegistroInformacionDto.telefono,
        idTipo: tipoUsuario.id,
        idEmpresas: updateRegistroInformacionDto.idEmpresas,
        idSucursal: updateRegistroInformacionDto.idSucursal,
        idAreaSucursal: updateRegistroInformacionDto.idAreaSucursal,
        fotoPerfil: '',
      };

      return await this.usuariosService.updateUserEmpresa(updateRegistroInformacionDto.idUsuario, updateUsuarioDto);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al editar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {

    try {

      const result = await this.registroInformacionService.remove(+id);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al eliminar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }
}
