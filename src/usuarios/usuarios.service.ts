import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuarios } from '../entities/Usuarios';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { TipoUsuario } from '../entities/TipoUsuario';
import { changePasswordDto } from './dto/changePasswordDto';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { SucursalesInformacion } from '../entities/SucursalesInformacion';
import { SucursalesAreasInformacion } from '../entities/SucursalesAreasInformacion';
import { updateUsuarioEmpresaDto } from './dto/update-usuario-empresa.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { Roles } from '../entities/Roles';
import { RegistroInformacion } from '../entities/RegistroInformacion';

@Injectable()
export class UsuariosService {

  private readonly logger = new Logger("UsuarioService");

  constructor(
    @InjectRepository(Usuarios)
    private usuariosRepository: Repository<Usuarios>,

    @InjectRepository(TipoUsuario)
    private tipos_usuariosRepository: Repository<TipoUsuario>,

    @InjectRepository(EmpresasInformacion)
    private EmpresasInformacionRepository: Repository<EmpresasInformacion>,

    @InjectRepository(SucursalesInformacion)
    private SucursalesInformacionRepository: Repository<SucursalesInformacion>,

    @InjectRepository(SucursalesAreasInformacion)
    private SucursalesAreasInformacionRepository: Repository<SucursalesAreasInformacion>,

    @InjectRepository(Roles)
    private RolesRepository: Repository<Roles>,

    @InjectRepository(RegistroInformacion)
    private RegistroInformacionRepository: Repository<RegistroInformacion>,

  ) { }


  async getTipoUsuario() {

    return await this.tipos_usuariosRepository.findOne({ where: { descripcion: 'aplicacion' } });
  }

  async getTipoUsuarioById(idTipo: number) {
    return await this.tipos_usuariosRepository.findOneBy({ id: idTipo });
  }


  async create(createUsuarioDto: CreateUsuarioDto) {

    try {

      const { password, idTipo, idAreaSucursal, ...userInfo } = createUsuarioDto;

      let areaSucursal;

      if (idAreaSucursal !== null && idAreaSucursal !== undefined) {
        areaSucursal = await this.SucursalesAreasInformacionRepository.findOneBy({ id: idAreaSucursal });

        if (!areaSucursal) {
          throw new NotFoundException(`area de sucursal con id ${idAreaSucursal} no encontrada`);
        }
      }

      // Buscar la relación TipoUsuario 
      const tipoUsuario = await this.tipos_usuariosRepository.findOne({ where: { id: idTipo } });

      let role: Roles;

      if (!tipoUsuario) {
        throw new NotFoundException(`TipoUsuario con ID ${idTipo} no encontrado`);
      }

      if (createUsuarioDto.role_id === undefined || createUsuarioDto.role_id === null) {
        role = null;
      } else {
        role = await this.RolesRepository.findOneBy({ id: createUsuarioDto.role_id });
      }
    
      // Generar la passwordSalt
      const passwordSalt = bcrypt.genSaltSync(10);

      // Hashear la contraseña con passwordSalt generada
      const passwordHash = bcrypt.hashSync(password, passwordSalt);

      // Convertir hash y sal a Buffer
      const passwordHashBuffer = Buffer.from(passwordHash, 'utf-8');
      const saltBuffer = Buffer.from(passwordSalt, 'utf-8');

      // Crear el usuario
      const usuario = this.usuariosRepository.create({
        ...userInfo,
        passwordhash: passwordHashBuffer,
        passwordsalt: saltBuffer,
        idTipo: tipoUsuario,
        role: role,
        areaSucursal: areaSucursal
      });

      await this.usuariosRepository.save(usuario);

      return usuario;

    } catch (error) {
      this.handleDBException(error);
    }
  }


  async updatePhotoPerfil(user: string, fotoPerfil: string) {

    try {

      // let usuario: Usuarios;

      const usuario = await this.usuariosRepository.findOneBy({telefono: user});
 
      if (!usuario) {
        throw new NotFoundException(`Usuario con identificador ${user} no encontrado`);
      }

      const newFoto = usuario.id + "/" + fotoPerfil;

      usuario.fotoPerfil = newFoto;

      return await this.usuariosRepository.save(usuario);

    } catch (error) {
      this.handleDBException(error);
      return false;
    }

  }


  async existsEmail(email: string): Promise<boolean> {
    const count = await this.usuariosRepository.count({ where: { email } });
    return count > 0;
  }

  async existsPhoneNumber(telefono: string): Promise<boolean> {
    const count = await this.usuariosRepository.count({ where: { telefono } });
    return count > 0;
  }

  async findAll() {

    const users = await this.usuariosRepository.find({
      where: {
        estado: In([1, 2]),
      },
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        email: true,
        telefono: true,
        fotoPerfil: true,
        estado: true
      },
      relations: ['idTipo', 'usuariosRelacionEmpresas', 'usuariosRelacionEmpresas.idEmpresa', 'usuariosRelacionEmpresas.idSucursal', 'usuariosRelacionEmpresas.idAreaSucursal'],
    });

    return users;
  }

  async findOne(id: number) {
    return this.usuariosRepository.findOne({
      where: { id },
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        email: true,
        telefono: true,
        fotoPerfil: true,
        estado: true

      },
      relations: ['idTipo', 'usuariosRelacionEmpresas', 'usuariosRelacionEmpresas.idEmpresa', 'usuariosRelacionEmpresas.idSucursal', 'usuariosRelacionEmpresas.idAreaSucursal'],
    });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {

    try {

      const { idAreaSucursal, ...infoData } = updateUsuarioDto;

      const usuario = await this.usuariosRepository.findOne({ where: { id } });

      if (!usuario) {
        return new GenericResponse('400', `El usuario con Id ${id} no encontrado`, null);
      }

      const tipoUsuario = await this.tipos_usuariosRepository.findOneBy({ id: updateUsuarioDto.idTipo });

      if (!tipoUsuario) {
        return new GenericResponse('400', `El tipoUsuario con Id ${updateUsuarioDto.idTipo} no encontrado`, null);
      }

      let areaSucursal: SucursalesAreasInformacion;
      let role: Roles;

      if(updateUsuarioDto.idAreaSucursal!= null ){
        areaSucursal = await this.SucursalesAreasInformacionRepository.findOneBy({ id: idAreaSucursal });
        console.log(areaSucursal)

        if (!areaSucursal) {
          return new GenericResponse('400', `La areaSucursal con Id ${idAreaSucursal} no encontrada`, null);
        }

      }else if(updateUsuarioDto.idAreaSucursal == null){
        areaSucursal = null;
      }

      console.log(areaSucursal)

      if(updateUsuarioDto.role_id !=null){

        role = await this.RolesRepository.findOneBy({id: updateUsuarioDto.role_id});

        console.log(role)

        if (!role) {
          return new GenericResponse('400', `El rol con Id ${updateUsuarioDto.role_id} no encontrado`, null);
        }

      }else if(updateUsuarioDto.role_id == null){
        role = null;
      }

      const updatedUsuario = this.usuariosRepository.merge(usuario, {
        ...infoData,
        idTipo: tipoUsuario,
        role: role,
        areaSucursal: areaSucursal
      });

      await this.usuariosRepository.save(updatedUsuario);

      const registroInformacion = await this.RegistroInformacionRepository.findOne({
        where: {idUsuario:usuario},
        relations: ['idUsuario.areaSucursal.idSucursal.idEmpresa', 'idUsuario.role']
      })

      return new GenericResponse('200', `EXITO`, registroInformacion);

    } catch (error) {
      return new GenericResponse('500', `Error al editar usuario de empresa `, error);
    }
  }



  async verifiUser(user: string): Promise<Usuarios> {

    let usuario: Usuarios;

    // Verificar si el campo user es un email o un número de teléfono
    if (this.isEmail(user)) {
      // Buscar usuario por email
      usuario = await this.usuariosRepository.findOne({
        where: { email: user, estado: 2 },
      });
    } else if (this.isPhoneNumber(user)) {
      // Buscar usuario por número de teléfono
      usuario = await this.usuariosRepository.findOne({
        where: { telefono: user, estado: 2 },
      });
    }

    return usuario;
  }

  // Método para verificar si el user es un email válido
  private isEmail(user: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(user);
  }

  // Método para verificar si el user es un número de teléfono válido
  private isPhoneNumber(user: string): boolean {
    const phoneRegex = /^[0-9]{10,15}$/; // Ajusta la expresión regular según el formato de número de teléfono que necesites
    return phoneRegex.test(user);
  }

  async verfiPassword(currentPassword: string, user: Usuarios): Promise<boolean> {

    // Verificar la contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, user.passwordhash.toString());
    if (!isMatch) {
      return false;
    }

    return true;
  }

  async changePassword(changePasswordDto: changePasswordDto, usuario: Usuarios): Promise<boolean> {

    try {

      // Encriptar la nueva contraseña
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(changePasswordDto.newPassword, salt);

      // Convertir el hash y el salt en Buffer si es necesario
      const passwordHashBuffer = Buffer.from(hash);
      const passwordSaltBuffer = Buffer.from(salt);

      // Actualizar el usuario con la nueva contraseña y el salt
      usuario.passwordhash = passwordHashBuffer;
      usuario.passwordsalt = passwordSaltBuffer;
      usuario.estado = 2;

      await this.usuariosRepository.save(usuario);

      return true;

    } catch (error) {
      this.handleDBException(error);
      return false;
    }
  }


  async remove(id: number) {

    try {

      const usuario = await this.usuariosRepository.findOneBy({ id });

      if (!usuario) {
        throw new NotFoundException(`usuario con ID ${id} no encontrado`);
      }

      usuario.estado = 0;

      return await this.usuariosRepository.save(usuario);

    } catch (error) {
      this.handleDBException(error);
    }
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(`Error: ${error.message}`);
    throw new InternalServerErrorException(NotFoundException);
  }
}
