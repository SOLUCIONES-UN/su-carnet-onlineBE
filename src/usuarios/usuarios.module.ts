import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuarios } from '../entities/Usuarios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoUsuario } from '../entities/TipoUsuario';

@Module({

  imports:[
    TypeOrmModule.forFeature([Usuarios]),
    TypeOrmModule.forFeature([TipoUsuario]),
  ],

  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class UsuariosModule {}
