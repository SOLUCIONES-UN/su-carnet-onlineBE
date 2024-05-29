import { Module } from '@nestjs/common';
import { TiposUsuarioService } from './tipos_usuario.service';
import { TiposUsuarioController } from './tipos_usuario.controller';
import { TipoUsuario } from '../entities/TipoUsuario';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NivelesAcceso } from '../entities/NivelesAcceso';

@Module({
  
  imports:[
    TypeOrmModule.forFeature([TipoUsuario, NivelesAcceso]),
  ],

  controllers: [TiposUsuarioController],
  providers: [TiposUsuarioService],
})
export class TiposUsuarioModule {}
