import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuarios } from '../entities/Usuarios';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { TipoUsuario } from '../entities/TipoUsuario';
import { changePasswordDto } from './dto/changePasswordDto';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { UsuariosRelacionEmpresas } from '../entities/UsuariosRelacionEmpresas';
import { strict } from 'assert';

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

    @InjectRepository(UsuariosRelacionEmpresas)
    private UsuariosRelacionEmpresasRepository: Repository<UsuariosRelacionEmpresas>,

  ) { }

  async create(createUsuarioDto: CreateUsuarioDto) {

    try {
      const { password, idTipo, idEmpresas, ...userInfo } = createUsuarioDto;
      let empresas = [];

      // Validar empresas si existen
      if (idEmpresas !== null && idEmpresas !== undefined && idEmpresas.length > 0) {
        empresas = await this.EmpresasInformacionRepository.findByIds(idEmpresas);

        if (empresas.length !== idEmpresas.length) {
          throw new NotFoundException(`Una o más empresas no fueron encontradas`);
        }
      }

      // Buscar la relación TipoUsuario 
      const tipoUsuario = await this.tipos_usuariosRepository.findOne({ where: { id: idTipo } });

      if (!tipoUsuario) {
        throw new NotFoundException(`TipoUsuario con ID ${idTipo} no encontrado`);
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
      });

      await this.usuariosRepository.save(usuario);

      // Crear las relaciones entre usuario y empresas si existen
      if (empresas.length > 0) {
        for (const empresa of empresas) {
          const UsuariosRelacionEmpresas = this.UsuariosRelacionEmpresasRepository.create({
            idUsuario: usuario,
            idEmpresa: empresa
          });
          await this.UsuariosRelacionEmpresasRepository.save(UsuariosRelacionEmpresas);
        }
      }

      return usuario;

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async registrarFotoPerfil(user: string, fotoPerfil: string) {

    try {

      let usuario: Usuarios;

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

      usuario.fotoPerfil = fotoPerfil;
      await this.usuariosRepository.save(usuario);

      return true;

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

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto; // Corregido offset inicial a 0
  
    const users = await this.usuariosRepository.find({
      where: {
        estado: In([1, 2]),
      },
      skip: offset * limit,
      take: limit,
      select: { 
        id: true,
        nombres: true,
        apellidos: true,
        email: true,
        telefono: true,
        fotoPerfil: true,
        estado: true
        
      },
      relations: ['idTipo', 'usuariosRelacionEmpresas', 'usuariosRelacionEmpresas.idEmpresa'], // Incluye la relación con empresas
    });
  
    return users;
  }

  async findOne(id: number) {

    console.log("el id es "+ id)
    return this.usuariosRepository.findOne({
      where: { id },
      relations: ['idTipo', 'usuariosRelacionEmpresas'],
    });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {

    try {
      const usuario = await this.usuariosRepository.findOne({ where: { id } });
  
      if (!usuario) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }
  
      // Cargar explícitamente la relación usuariosRelacionEmpresas
      await this.usuariosRepository
        .createQueryBuilder('usuario')
        .leftJoinAndSelect('usuario.usuariosRelacionEmpresas', 'usuariosRelacionEmpresas')
        .where('usuario.id = :id', { id })
        .getOneOrFail();
  
      let empresas: EmpresasInformacion[] = [];
  
      // Validar empresas si existen en el DTO
      if (updateUsuarioDto.idEmpresas && updateUsuarioDto.idEmpresas.length > 0) {
        empresas = await this.EmpresasInformacionRepository.findByIds(updateUsuarioDto.idEmpresas);
  
        if (empresas.length !== updateUsuarioDto.idEmpresas.length) {
          throw new NotFoundException(`Una o más empresas no fueron encontradas`);
        }
      }
  
      if (updateUsuarioDto.idTipo !== undefined) {
        const tipoUsuario = await this.tipos_usuariosRepository.findOne({ where: { id: updateUsuarioDto.idTipo } });
        if (!tipoUsuario) {
          throw new NotFoundException(`TipoUsuario con ID ${updateUsuarioDto.idTipo} no encontrado`);
        }
        usuario.idTipo = tipoUsuario;
      }
  
      // Actualizar los demás campos, exceptuando `idTipo`, `password` y `idEmpresas`
      for (const key in updateUsuarioDto) {
        if (updateUsuarioDto.hasOwnProperty(key) && key !== 'idTipo' && key !== 'password' && key !== 'idEmpresas') {
          usuario[key] = updateUsuarioDto[key];
        }
      }
  
      await this.usuariosRepository.save(usuario);
  
      // Si usuario.usuariosRelacionEmpresas es undefined, inicializar como un array vacío
      if (!usuario.usuariosRelacionEmpresas) {
        usuario.usuariosRelacionEmpresas = [];
      }
  
      // Actualizar las relaciones entre usuario y empresas
      if (updateUsuarioDto.idEmpresas === undefined || updateUsuarioDto.idEmpresas.length === 0) {
        // Si idEmpresas no está definido o está vacío, dar de baja todas las relaciones existentes
        for (const relacion of usuario.usuariosRelacionEmpresas) {
          relacion.estado = 0; // Cambiar estado a 0 para dar de baja la relación
        }
      } else {
        // Si idEmpresas contiene elementos, actualizar las relaciones existentes o crear nuevas
        for (const empresa of empresas) {
          let relacionExistente = usuario.usuariosRelacionEmpresas.find(rel => rel.idEmpresa.id === empresa.id);
  
          if (relacionExistente) {
            if (relacionExistente.estado === 0) {
              relacionExistente.estado = 1; // Activar relación existente si estaba dada de baja
            }
          } else {
            const nuevaRelacion = this.UsuariosRelacionEmpresasRepository.create({
              idUsuario: usuario,
              idEmpresa: empresa,
              estado: 1 // Estado activo
            });
            usuario.usuariosRelacionEmpresas.push(nuevaRelacion);
          }
        }
  
        // Desactivar relaciones que no están en el DTO
        for (const relacion of usuario.usuariosRelacionEmpresas) {
          if (!empresas.find(e => e.id === relacion.idEmpresa.id)) {
            relacion.estado = 0;
          }
        }
      }
  
      // Guardar todas las relaciones actualizadas
      await this.UsuariosRelacionEmpresasRepository.save(usuario.usuariosRelacionEmpresas);
  
      return updateUsuarioDto;
    } catch (error) {
      this.handleDBException(error);
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
