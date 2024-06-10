import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
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

  private readonly logger = new Logger("authService");

  constructor(

    @InjectRepository(Usuarios)
    private userRepository: Repository<Usuarios>,

    private readonly jwtService: JwtService

  ) {}

  async login( LoginUserDto: LoginUserDto) {

    const { email, password } = LoginUserDto;

   

      const user = await this.userRepository.findOne(
        { 
          where: { email },
          select: { email: true, passwordhash: true, passwordsalt: true, nombres: true, apellidos: true, telefono: true,} 
        }
  
      );
  
      if(!user) 
        throw new UnauthorizedException('Credenciales invalidas');
  
      const hashToCompare = bcrypt.hashSync(password, user.passwordsalt.toString('utf-8'));
  
      if( hashToCompare !== user.passwordhash.toString('utf-8') )
        throw new UnauthorizedException('Credenciales invalidas');
      
      delete user.passwordhash
      delete user.passwordsalt
      
      return {
        ...user,
        token: this.getJwtToken({ email: user.email})
      };

  }

  async newToken(email: string, accesKey: string): Promise<string>{

    if(accesKey === process.env.JWT_SECRET){
      
      const payload: JwtPayload = {
        email: email
      };
  
      return this.getJwtToken(payload);
    }

    return "error";
  }

  async exisUser(email: string){
    const user = await this.userRepository.findOne({
      where: { email: email, estado: 2 },
    });

    return user;
  }


  private getJwtToken( payload: JwtPayload ) 
  {

    const token = this.jwtService.sign( payload );

    return token;

  }

}
