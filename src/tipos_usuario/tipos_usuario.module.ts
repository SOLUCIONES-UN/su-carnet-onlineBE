import { Module } from '@nestjs/common';
import { TiposUsuarioService } from './tipos_usuario.service';
import { TiposUsuarioController } from './tipos_usuario.controller';
import { TipoUsuario } from '../entities/TipoUsuario';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  
  imports:[
    TypeOrmModule.forFeature([TipoUsuario]),
  ],

  controllers: [TiposUsuarioController],
  providers: [TiposUsuarioService],
})
export class TiposUsuarioModule {}
