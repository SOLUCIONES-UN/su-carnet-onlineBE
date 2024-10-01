import { Module } from '@nestjs/common';
import { RegistroAfiliacionesService } from './registro_afiliaciones.service';
import { RegistroAfiliacionesController } from './registro_afiliaciones.controller';
import { RegistroAfiliaciones } from '../entities/RegistroAfiliaciones';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuarios } from '../entities/Usuarios';
import { Dispositivos } from '../entities/Dispositivos';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { FirebaseAdminModule } from '../firebase-admin/firebase-admin.module'

@Module({
  imports:[
    FirebaseAdminModule,
    TypeOrmModule.forFeature([EmpresasInformacion, RegistroAfiliaciones, Usuarios, Dispositivos]),
  ],

  controllers: [RegistroAfiliacionesController],
  providers: [RegistroAfiliacionesService, NotificacionesService],
})
export class RegistroAfiliacionesModule {}
