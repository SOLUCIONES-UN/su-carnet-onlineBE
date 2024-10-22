import { Module } from '@nestjs/common';
import { ParticipacionUsuariosService } from './participacion-usuarios.service';
import { ParticipacionUsuariosController } from './participacion-usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RespuestasUsuariosConcursos } from '../entities/RespuestasUsuariosConcursos';
import { FormulariosConcursos } from '../entities/FormulariosConcursos';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { EventosEmpresa } from '../entities/EventosEmpresa';
import { AreasEventos } from '../entities/AreasEventos';
import { FechasEventos } from '../entities/FechasEventos';
import { Participaciones } from '../entities/Participaciones';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Participaciones,
      RespuestasUsuariosConcursos,
      RegistroInformacion,
      EventosEmpresa,
      AreasEventos,
      FechasEventos,
      FormulariosConcursos,
      RespuestasUsuariosConcursos,
    ]),
  ],

  controllers: [ParticipacionUsuariosController],
  providers: [ParticipacionUsuariosService],
})
export class ParticipacionUsuariosModule {}
