import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuarios } from '../entities/Usuarios';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interface/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  private readonly logger = new Logger("authService");

  constructor(

    @InjectRepository(Usuarios)
    private userRepository: Repository<Usuarios>,

    private readonly jwtService: JwtService

  ) {}


  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
    //TODO: Implementar JWT
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }


  async login( LoginUserDto: LoginUserDto) {

    const { email, password } = LoginUserDto;

    try {

      const user = await this.userRepository.findOne(
        { 
          where: { email },
          select: { email: true, passwordhash: true, passwordsalt: true} 
        }
  
      );
  
      if(!user) 
        throw new UnauthorizedException('Credenciales invalidas');
  
      //   const hashToCompare = bcrypt.hashSync(password, user.passwordsalt.toString('base64'));
  
      // if( hashToCompare !== user.passwordhash.toString('base64'))
      //   throw new UnauthorizedException('Credenciales invalidas');
      
      delete user.passwordhash
      delete user.passwordsalt
      
      return {
        ...user,
        token: this.getJwtToken({ email: user.email})
      };

    } catch (error) {
      this.logger.error(error.message);
    }
  }


  private getJwtToken( payload: JwtPayload ) 
  {

    const token = this.jwtService.sign( payload );

    return token;

  }
}
