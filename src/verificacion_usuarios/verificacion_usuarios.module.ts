import { Module } from '@nestjs/common';
import { VerificacionUsuariosService } from './verificacion_usuarios.service';
import { VerificacionUsuariosController } from './verificacion_usuarios.controller';
import { Otps } from '../entities/Otps';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuarios } from '../entities/Usuarios';

@Module({

  imports:[
    TypeOrmModule.forFeature([Otps]),
    TypeOrmModule.forFeature([Usuarios]),
  ],

  controllers: [VerificacionUsuariosController],
  providers: [VerificacionUsuariosService],
})
export class VerificacionUsuariosModule {}
