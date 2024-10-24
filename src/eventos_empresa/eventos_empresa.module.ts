import { Module } from '@nestjs/common';
import { EventosEmpresaService } from './eventos_empresa.service';
import { EventosEmpresaController } from './eventos_empresa.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventosEmpresa } from '../entities/EventosEmpresa';
import { FechasEventos } from '../entities/FechasEventos';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { Usuarios } from '../entities/Usuarios';
import { Dispositivos } from '../entities/Dispositivos';
import { Notificaciones } from '../entities/Notificaciones';
import { RegistroAfiliaciones } from '../entities/RegistroAfiliaciones';
import { TipoDocumentos } from '../entities/TipoDocumentos';
import { ArchivosEventos } from '../entities/ArchivosEventos';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { FirebaseAdminModule } from '../firebase-admin/firebase-admin.module';
import { AreasEventos } from '../entities/AreasEventos';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { FormulariosConcursos } from '../entities/FormulariosConcursos';
import { Participaciones } from '../entities/Participaciones';

@Module({
  imports: [
    FirebaseAdminModule,
    TypeOrmModule.forFeature([
      EventosEmpresa,
      FechasEventos,
      EmpresasInformacion,
      Usuarios,
      Dispositivos,
      Notificaciones,
      RegistroAfiliaciones,
      Notificaciones,
      TipoDocumentos,
      ArchivosEventos,
      AreasEventos,
      RegistroInformacion,
      FormulariosConcursos,
      Participaciones,
    ]),
  ],

  controllers: [EventosEmpresaController],
  providers: [EventosEmpresaService, NotificacionesService],
})
export class EventosEmpresaModule {}