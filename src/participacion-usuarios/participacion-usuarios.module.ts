import { Module } from '@nestjs/common';
import { ParticipacionUsuariosService } from './participacion-usuarios.service';
import { ParticipacionUsuariosController } from './participacion-usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RespuestasUsuariosConcursos } from '../entities/RespuestasUsuariosConcursos';
import { FormulariosConcursos } from '../entities/FormulariosConcursos';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RespuestasUsuariosConcursos,
      FormulariosConcursos,
    ]),
  ],

  controllers: [ParticipacionUsuariosController],
  providers: [ParticipacionUsuariosService],
})
export class ParticipacionUsuariosModule {}
