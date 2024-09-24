import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuarios } from '../entities/Usuarios';
import { IsNull, Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interface/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { TipoUsuario } from '../entities/TipoUsuario';
import { SucursalesInformacion } from '../entities/SucursalesInformacion';
import { SucursalesAreasInformacion } from '../entities/SucursalesAreasInformacion';
import { RegistroInformacion } from '../entities/RegistroInformacion';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('authService');

  constructor(
    @InjectRepository(Usuarios)
    private userRepository: Repository<Usuarios>,

    @InjectRepository(EmpresasInformacion)
    private empresasRepository: Repository<EmpresasInformacion>,

    @InjectRepository(SucursalesInformacion)
    private SucursalesInformacionRepository: Repository<SucursalesInformacion>,

    @InjectRepository(TipoUsuario)
    private TipoUsuarioRepository: Repository<TipoUsuario>,

    @InjectRepository(RegistroInformacion)
    private RegistroInformacionRepository: Repository<RegistroInformacion>,

    @InjectRepository(Usuarios)
    private usuariosRepository: Repository<Usuarios>,

    private readonly jwtService: JwtService,
  ) { }

  async login(LoginUserDto: LoginUserDto) {

    try {

      const { user, password, companyCode } = LoginUserDto;

      let usuario: Usuarios;
      let registroInformacion: RegistroInformacion;
      let empresa: EmpresasInformacion;
      let sucursal: SucursalesInformacion = null;
      let areaSucursal: SucursalesAreasInformacion = null;

      if (companyCode) {
        empresa = await this.empresasRepository.findOneBy({ codigoEmpresa: companyCode });

        if (!empresa) {
          return new GenericResponse('400', `La empresa con código ${companyCode} no encontrada`, empresa);
        }
      }

      if (this.isEmail(user)) {
        usuario = await this.findUserByEmail(user);
      } else if (this.isPhoneNumber(user)) {
        usuario = await this.findUserByPhone(user);
      }

      if (!usuario) return new GenericResponse('400', `El usuario no existe o puede estar inactivo`, null);


      if (companyCode === null || companyCode === '') {

        const tieneArea = await this.usuariosRepository.findOne({
          where: {id: usuario.id ,areaSucursal: Not(IsNull())}, 
          relations: ['areaSucursal', 'areaSucursal.idSucursal']
        });

        if (tieneArea) {
          return new GenericResponse('401', `El usuario pertenece a una empresa debe ingresar el codigo de la empresa`, null);
        }

      } else if (companyCode != null || companyCode != '') {
        const tieneArea = await this.usuariosRepository.findOne({
          where: {id: usuario.id ,areaSucursal: Not(IsNull())}, 
          relations: ['areaSucursal', 'areaSucursal.idSucursal']
        });

        if (!tieneArea) {
          return new GenericResponse('401', `El usuario no esta relacionado a ninguna empresa`, null);
        }

        sucursal = tieneArea.areaSucursal.idSucursal;
        areaSucursal = tieneArea.areaSucursal;

      }

      const hashToCompare = bcrypt.hashSync(password, usuario.passwordsalt.toString('utf-8'));

      if (hashToCompare !== usuario.passwordhash.toString('utf-8')) {
        return new GenericResponse('400', `Credenciales inválidas`, null);
      }

      delete usuario.passwordhash;
      delete usuario.passwordsalt;

      registroInformacion = await this.RegistroInformacionRepository.findOneBy({ idUsuario: usuario });

      const responseData = {
        usuario: {
          email: usuario.email,
          nombres: usuario.nombres,
          apellidos: usuario.apellidos,
          telefono: usuario.telefono,
          id: usuario.id,
          tipoUsuario: usuario.idTipo,
        },
        registroInformacion,
        empresa: empresa ? {
          id: empresa.id,
          nombre: empresa.nombre,
          codigoEmpresa: empresa.codigoEmpresa,
          disclaimer: empresa.disclaimer,
          sitioWeb: empresa.sitioWeb,
          logotipo: empresa.logotipo
        } : null,
        sucursal: sucursal ? {
          id: sucursal.id,
          descripcion: sucursal.descripcion,
          direccion: sucursal.direccion,
          archivoImagen1: sucursal.archivoImagen1,
          archivoImagen2: sucursal.archivoImagen1
        } : null,
        areaSucursal: areaSucursal ? {
          id: areaSucursal.id,
          descripcion: areaSucursal.descripcion
        } : null,
        token: this.getJwtToken({ email: usuario.email }),
      };

      return new GenericResponse('201', `EXITO`, responseData);

    } catch (error) {
      return new GenericResponse('500', `error`, error.message);
    }
  }

  private isEmail(user: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(user);
  }

  // Método para verificar si el user es un número de teléfono válido
  private isPhoneNumber(user: string): boolean {
    const phoneRegex = /^[0-9]{10,15}$/; // Ajusta la expresión regular según el formato de número de teléfono que necesites
    return phoneRegex.test(user);
  }


  //Metodo login para administracion
  async loginAdministracion(LoginUserDto: LoginUserDto): Promise<GenericResponse<any>> {

    try {
      const { user, password, companyCode } = LoginUserDto;

      let usuario: Usuarios;
      let registroInformacion: RegistroInformacion;
      let empresa: EmpresasInformacion;
      let sucursal: SucursalesInformacion = null;
      let areaSucursal: SucursalesAreasInformacion = null;

      if (companyCode) {
        empresa = await this.empresasRepository.findOneBy({ codigoEmpresa: companyCode });

        if (!empresa) {
          return new GenericResponse('400', `La empresa con código ${companyCode} no encontrada`, empresa);
        }
      }
      

      if (this.isEmail(user)) {
        usuario = await this.findUserByEmail(user);
      } else if (this.isPhoneNumber(user)) {
        usuario = await this.findUserByPhone(user);
      }

      if (!usuario) return new GenericResponse('400', `El usuario no existe o puede estar inactivo`, null);

      if (companyCode === null || companyCode === '') {

        const tieneArea = await this.usuariosRepository.findOne({
          where: {id: usuario.id ,areaSucursal: Not(IsNull())}, 
          relations: ['areaSucursal', 'areaSucursal.idSucursal']
        });

        if (tieneArea) {
          return new GenericResponse('401', `El usuario pertenece a una empresa debe ingresar el codigo de la empresa`, null);
        }

        const tipoUsuario = await this.TipoUsuarioRepository.findOne({ where: { descripcion: 'administrador' } });

        if (usuario.idTipo.id != tipoUsuario.id) {
          return new GenericResponse('401', `El usuario no pertenece a este nivel no es un administrador`, null);
        }

      } else if (companyCode != null || companyCode != '') {
        const tieneArea = await this.usuariosRepository.findOne({
          where: {id: usuario.id ,areaSucursal: Not(IsNull())}, 
          relations: ['areaSucursal', 'areaSucursal.idSucursal']
        });

        if (!tieneArea) {
          return new GenericResponse('401', `El usuario no esta relacionado a ninguna empresa`, null);
        }

        sucursal = tieneArea.areaSucursal.idSucursal;
        areaSucursal = tieneArea.areaSucursal;
    
      }

      const hashToCompare = bcrypt.hashSync(password, usuario.passwordsalt.toString('utf-8'));

      if (hashToCompare !== usuario.passwordhash.toString('utf-8')) {
        return new GenericResponse('400', `Credenciales inválidas`, null);
      }

      delete usuario.passwordhash;
      delete usuario.passwordsalt;

      registroInformacion = await this.RegistroInformacionRepository.findOneBy({ idUsuario: usuario });

      const responseData = {
        usuario: {
          email: usuario.email,
          nombres: usuario.nombres,
          apellidos: usuario.apellidos,
          telefono: usuario.telefono,
          id: usuario.id,
          tipoUsuario: usuario.idTipo,
        },
        registroInformacion,
        empresa: empresa ? {
          id: empresa.id,
          nombre: empresa.nombre,
          codigoEmpresa: empresa.codigoEmpresa,
          disclaimer: empresa.disclaimer,
          sitioWeb: empresa.sitioWeb,
          logotipo: empresa.logotipo
        } : null,
        sucursal: sucursal ? {
          id: sucursal.id,
          descripcion: sucursal.descripcion,
          direccion: sucursal.direccion,
        } : null,
        areaSucursal: areaSucursal ? {
          id: areaSucursal.id,
          descripcion: areaSucursal.descripcion
        } : null,
        token: this.getJwtToken({ email: usuario.email }),
      };

      return new GenericResponse('201', `EXITO`, responseData);

    } catch (error) {
      return new GenericResponse('500', `error`, error);
    }
  }


  private async findUserByEmail(email: string): Promise<Usuarios> {
    return this.userRepository.findOne({
      where: { email, estado: 2 },
      select: this.getUserSelectFields(),
      relations: ['registroInformacions', 'idTipo','areaSucursal', 'role'],
    });
  }

  private async findUserByPhone(phone: string): Promise<Usuarios> {
    return this.userRepository.findOne({
      where: { telefono: phone, estado: 2 },
      select: this.getUserSelectFields(),
      relations: ['registroInformacions', 'idTipo','areaSucursal', 'role'],
    });
  }

  private getUserSelectFields() {
    return {
      email: true,
      passwordhash: true,
      passwordsalt: true,
      nombres: true,
      apellidos: true,
      telefono: true,
      id: true,
    };
  }

  async newToken(email: string, accesKey: string): Promise<string> {
    if (accesKey === process.env.JWT_SECRET) {
      const payload: JwtPayload = {
        email: email,
      };

      return this.getJwtToken(payload);
    }

    return 'error';
  }

  async exisUser(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email, estado: 2 },
    });

    return user;
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);

    return token;
  }
}
