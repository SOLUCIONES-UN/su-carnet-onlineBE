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

@Injectable()
export class AuthService {
  private readonly logger = new Logger('authService');

  constructor(
    @InjectRepository(Usuarios)
    private userRepository: Repository<Usuarios>,

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


  // async loginAdministracion(LoginUserDto: LoginUserDto) {

  //   let usuario: Usuarios;

  //     if (this.isEmail(user)) {
  //       usuario = await this.usuariosRepository.findOne({
  //         where: { email: user },
  //       });
  //     } else if (this.isPhoneNumber(user)) {
  //       usuario = await this.usuariosRepository.findOne({
  //         where: { telefono: user },
  //       });
  //     }

  //   const { email, password } = LoginUserDto;

  //   //find user by email
  //   const user = await this.userRepository.findOne({
  //     where: { email },
  //     select: {
  //       email: true,
  //       passwordhash: true,
  //       passwordsalt: true,
  //       nombres: true,
  //       apellidos: true,
  //       telefono: true,
  //       id: true,
  //     },
  //     relations: ['registroInformacions'],
  //   });

  //   if (!user) throw new UnauthorizedException('Credenciales invalidas');

  //   const hashToCompare = bcrypt.hashSync(
  //     password,
  //     user.passwordsalt.toString('utf-8'),
  //   );

  //   if (hashToCompare !== user.passwordhash.toString('utf-8'))
  //     throw new UnauthorizedException('Credenciales invalidas');

  //   delete user.passwordhash;
  //   delete user.passwordsalt;

  //   return {
  //     ...user,
  //     token: this.getJwtToken({ email: user.email }),
  //   };
  // }

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
