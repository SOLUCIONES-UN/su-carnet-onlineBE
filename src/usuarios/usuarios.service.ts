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
      relations: ['idTipo', 'usuariosRelacionEmpresas', 'usuariosRelacionEmpresas.idEmpresa'], 
    });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {

    try {

      const usuario = await this.usuariosRepository.findOne({ where: { id } });

      if (!usuario) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      if (updateUsuarioDto.idEmpresas && updateUsuarioDto.idEmpresas.length > 0) {

        for (let i = 0; i < updateUsuarioDto.idEmpresas.length; i++) {

          const idempresa = updateUsuarioDto.idEmpresas[i];
          const empresa = await this.EmpresasInformacionRepository.findOneBy({ id: idempresa });

          const relacionesEncontradas = await this.UsuariosRelacionEmpresasRepository.find({
            where: {
              idUsuario: usuario,
              idEmpresa: empresa,
            },
          });

          let relacionEncontrada: UsuariosRelacionEmpresas | null = null;

          if (relacionesEncontradas.length > 0) {

            relacionEncontrada = relacionesEncontradas[0];
            relacionEncontrada.estado = 1;
            await this.UsuariosRelacionEmpresasRepository.save(relacionesEncontradas);

          }
          else if (relacionesEncontradas.length === 0) {

            const relacionUsuarioEmpresa = this.UsuariosRelacionEmpresasRepository.create({
              idEmpresa: empresa,
              idUsuario: usuario
            });
            await this.UsuariosRelacionEmpresasRepository.save(relacionUsuarioEmpresa);
          }

        }

      } else if (updateUsuarioDto.idEmpresas && updateUsuarioDto.idEmpresas.length === 0) {

        const relacionesEncontradas = await this.UsuariosRelacionEmpresasRepository.find({
          where: {
            idUsuario: usuario
          },
        });

        if (relacionesEncontradas.length > 0) {

          relacionesEncontradas.forEach(async element => {
            element.estado = 0;
            await this.UsuariosRelacionEmpresasRepository.save(element);
          });
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
