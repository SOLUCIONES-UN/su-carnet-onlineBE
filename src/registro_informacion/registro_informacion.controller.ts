import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { RegistroInformacionService } from './registro_informacion.service';
import { CreateRegistroInformacionDto } from './dto/create-registro_informacion.dto';
import { UpdateRegistroInformacionDto } from './dto/update-registro_informacion.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { UsuariosService } from '../usuarios/usuarios.service';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { updateUsuarioEmpresaDto } from '../usuarios/dto/update-usuario-empresa.dto';
import { UpdateUsuarioDto } from '../usuarios/dto/update-usuario.dto';

@Controller('registro-informacion')
export class RegistroInformacionController {
  constructor(private readonly registroInformacionService: RegistroInformacionService,
    private readonly usuariosService: UsuariosService
  ) {}

  @Post()
  async create(@Body() createRegistroInformacionDto: CreateRegistroInformacionDto) {

    try {

      const existeRegistroVisita = await this.registroInformacionService.existRegistroVisita(createRegistroInformacionDto.documento);

      if(existeRegistroVisita) {

        const result = await this.registroInformacionService.UpdateUserVisita(createRegistroInformacionDto, existeRegistroVisita.idUsuario);

        return result;
      }

      const registroInformacion = await this.registroInformacionService.existRegistro(createRegistroInformacionDto.documento);
  
      if (registroInformacion) {
        return new GenericResponse('401', `Ya existe un registro con el DPI ${createRegistroInformacionDto.documento}`, null);
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

    if (createRegistroInformacionDto.role_id === undefined || createRegistroInformacionDto.role_id === null) {
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
        idAreaSucursal: createRegistroInformacionDto.idAreaSucursal,
        idTipo: tipoUsuario.id,
        role_id: createRegistroInformacionDto.role_id,
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
      return result;
  
    } catch (error) {
      return new GenericResponse('401', 'Error al registrar la información', error.message);
    }
  }

  @Get()
  async findAll() {
    return await this.registroInformacionService.findAll();
  }

  @Get('findAllByEmpresa/:idEmpresa')
  async findAllByEmpresa(@Param('idEmpresa') idEmpresa:number) {
    return  await this.registroInformacionService.findAllByEmpresa(idEmpresa);
  }

  @Get('findAllByUsuario/:idUsuario')
  async findAllByUsuario(@Param('idUsuario') idUsuario: number) {
    return await this.registroInformacionService.findAllByUsuario(idUsuario);
  }


  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRegistroInformacionDto: UpdateRegistroInformacionDto) {
    
    try {

      await this.registroInformacionService.update(+id, updateRegistroInformacionDto);

      let tipoUsuario;
  
      if (updateRegistroInformacionDto.idTipo === undefined || updateRegistroInformacionDto.idTipo === null) {
        tipoUsuario = await this.usuariosService.getTipoUsuario();
      } else {
        tipoUsuario = { id: updateRegistroInformacionDto.idTipo };
      }

    if (updateRegistroInformacionDto.role_id === undefined || updateRegistroInformacionDto.role_id === null) {
      tipoUsuario = await this.usuariosService.getTipoUsuario();
    } else {
      tipoUsuario = { id: updateRegistroInformacionDto.idTipo };
    }
  

      let updateUsuarioDto: UpdateUsuarioDto = {
        nombres: updateRegistroInformacionDto.nombres,
        apellidos: updateRegistroInformacionDto.apellidos,
        email: updateRegistroInformacionDto.correo,
        telefono: updateRegistroInformacionDto.telefono,
        idTipo: tipoUsuario.id,
        role_id: updateRegistroInformacionDto.role_id,
        idAreaSucursal: updateRegistroInformacionDto.idAreaSucursal,
        fotoPerfil: '',
      };

      return await this.usuariosService.update(updateRegistroInformacionDto.idUsuario, updateUsuarioDto);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al editar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.registroInformacionService.remove(+id);
  }
}
