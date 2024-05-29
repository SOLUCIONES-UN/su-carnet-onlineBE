import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuarios } from '../entities/Usuarios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoUsuario } from '../entities/TipoUsuario';
import { Otps } from '../entities/Otps';
import { VerificacionUsuariosService } from '../verificacion_usuarios/verificacion_usuarios.service';

@Module({

  imports:[
    TypeOrmModule.forFeature([Usuarios]),
    TypeOrmModule.forFeature([TipoUsuario]),
    TypeOrmModule.forFeature([Otps]),
  ],

  controllers: [UsuariosController],
  providers: [UsuariosService, VerificacionUsuariosService],
})
export class UsuariosModule {}
