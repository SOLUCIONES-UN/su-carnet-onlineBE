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
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interface/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { GenerateToken } from './dto/generateToken.dto';
import { use } from 'passport';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { UsuariosRelacionEmpresas } from '../entities/UsuariosRelacionEmpresas';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { TipoUsuario } from '../entities/TipoUsuario';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('authService');

  constructor(
    @InjectRepository(Usuarios)
    private userRepository: Repository<Usuarios>,

    @InjectRepository(EmpresasInformacion)
    private empresasRepository: Repository<EmpresasInformacion>,

    @InjectRepository(UsuariosRelacionEmpresas)
    private UsuariosRelacionEmpresasRepository: Repository<UsuariosRelacionEmpresas>,

    @InjectRepository(TipoUsuario)
    private TipoUsuarioRepository: Repository<TipoUsuario>,

    private readonly jwtService: JwtService,
  ) {}

  async login(LoginUserDto: LoginUserDto) {
    const { user, password } = LoginUserDto;

    let usuario: Usuarios;

    // Verificar si el campo user es un email o un número de teléfono
    if (this.isEmail(user)) {
      // Buscar usuario por email
      usuario = await this.userRepository.findOne({
        where: { email: user, estado: 2 },
        select: {
          email: true,
          passwordhash: true,
          passwordsalt: true,
          nombres: true,
          apellidos: true,
          telefono: true,
          id: true,
        },
        relations: ['registroInformacions'],
      });
    } else if (this.isPhoneNumber(user)) {
      // Buscar usuario por número de teléfono
      usuario = await this.userRepository.findOne({
        where: { telefono: user, estado: 2 },
        select: {
          email: true,
          passwordhash: true,
          passwordsalt: true,
          nombres: true,
          apellidos: true,
          telefono: true,
          id: true,
        },
        relations: ['registroInformacions'],
      });
    }

    if (!usuario) throw new UnauthorizedException('Credenciales invalidas');

    const hashToCompare = bcrypt.hashSync(
      password,
      usuario.passwordsalt.toString('utf-8'),
    );

    if (hashToCompare !== usuario.passwordhash.toString('utf-8'))
      throw new UnauthorizedException('Credenciales invalidas');

    delete usuario.passwordhash;
    delete usuario.passwordsalt;

    return {
      ...usuario,
      token: this.getJwtToken({ email: usuario.email }),
    };
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
  async loginAdministracion(LoginUserDto: LoginUserDto) : Promise<GenericResponse<any>> {

    try {

      const { user, password, companyCode } = LoginUserDto;

      let usuario: Usuarios;
      let empresa: EmpresasInformacion;

      if (companyCode) {
        empresa = await this.empresasRepository.findOneBy({ codigoEmpresa: companyCode });

        if (!empresa) {
          return new GenericResponse('400', `La empresa con código ${companyCode} no encontrada`, empresa);
          // throw new UnauthorizedException(`La empresa con código ${companyCode} no encontrada`);
        }
      }

      if (this.isEmail(user)) {
        usuario = await this.findUserByEmail(user);
      } else if (this.isPhoneNumber(user)) {
        usuario = await this.findUserByPhone(user);
      }

      if (!usuario)  return new GenericResponse('400', `El usuario no existe o puedes estar inactivo`, null);

      if(companyCode === null || companyCode === ''){

        const relacionEmpresa = await this.UsuariosRelacionEmpresasRepository.findOneBy({idUsuario:usuario});
        
        if(relacionEmpresa){
          return new GenericResponse('401', `El usuario pertenece a una empresa debe ingresar el codigo de la empresa`, null);
        }

        const tipoUsuario = await this.TipoUsuarioRepository.findOne({where: {descripcion: 'administrador'}});

        if(usuario.idTipo.id != tipoUsuario.id){
          return new GenericResponse('401', `El usuario no pertenece a este nivel no es un administrador`, null);
        }
        
      }else if(companyCode != null || companyCode != ''){
        const relacionEmpresa = await this.UsuariosRelacionEmpresasRepository.findOneBy({idUsuario:usuario});

        if(!relacionEmpresa){
          return new GenericResponse('401', `El usuario no esta relacionado a ninguna empresa`, null);
        }
      }

      const hashToCompare = bcrypt.hashSync(password, usuario.passwordsalt.toString('utf-8'));

      if (hashToCompare !== usuario.passwordhash.toString('utf-8')) {
        // throw new UnauthorizedException('Credenciales inválidas');
        return new GenericResponse('400', `Credenciales inválidas`, null);
      }

      delete usuario.passwordhash;
      delete usuario.passwordsalt;

      const responseData = {
          usuario: {
              email: usuario.email,
              nombres: usuario.nombres,
              apellidos: usuario.apellidos,
              telefono: usuario.telefono,
              id: usuario.id,
              registroInformacions: usuario.registroInformacions,
              tipoUsuario: usuario.idTipo,
          },
          empresa: empresa ? {
              cnombre: empresa.nombre,
              codigoEmpresa: empresa.codigoEmpresa,
              disclaimer: empresa.disclaimer,
              sitioWeb: empresa.sitioWeb,
              logotipo: empresa.logotipo
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
        relations: ['registroInformacions', 'idTipo'],
    });
}

private async findUserByPhone(phone: string): Promise<Usuarios> {
    return this.userRepository.findOne({
        where: { telefono: phone, estado: 2 },
        select: this.getUserSelectFields(),
        relations: ['registroInformacions', 'idTipo'],
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
