import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuarios } from '../entities/Usuarios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoUsuario } from '../entities/TipoUsuario';
import { Otps } from '../entities/Otps';
import { VerificacionUsuariosService } from '../verificacion_usuarios/verificacion_usuarios.service';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';

@Module({

  imports:[
    TypeOrmModule.forFeature([Usuarios, EmpresasInformacion, TipoUsuario, Otps])
  ],

  controllers: [UsuariosController],
  providers: [UsuariosService, VerificacionUsuariosService],
})
export class UsuariosModule {}
