import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuarios } from '../entities/Usuarios';
import { TipoUsuario } from '../entities/TipoUsuario';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { UsuariosRelacionEmpresas } from '../entities/UsuariosRelacionEmpresas';
import { SucursalesInformacion } from '../entities/SucursalesInformacion';
import { SucursalesAreasInformacion } from '../entities/SucursalesAreasInformacion';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [

    ConfigModule,

    TypeOrmModule.forFeature([ Usuarios, TipoUsuario, EmpresasInformacion, UsuariosRelacionEmpresas, SucursalesInformacion, SucursalesAreasInformacion]),
    

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync(
      {
        imports: [ConfigModule],
        inject: [ ConfigService ],
        useFactory: ( configService:ConfigService ) => {
          

          return {
            secret: configService.get('JWT_SECRET'),
            signOptions: { expiresIn: '24h' }
          }
        

        }
      }
    )

    // JwtModule.register({
    //   secret: process.env.JWT,
    //   signOptions: { expiresIn: '1h' }

    // })
  ],
  exports: [JwtStrategy, PassportModule, TypeOrmModule, JwtModule]
})
export class AuthModule {}
