import { Module } from '@nestjs/common';
import { RegistroColaboradoresService } from './registro-colaboradores.service';
import { RegistroColaboradoresController } from './registro-colaboradores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { Usuarios } from '../entities/Usuarios';
import { RegistroColaboradores } from '../entities/RegistroColaboradores';
import { Dispositivos } from '../entities/Dispositivos';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { FirebaseAdminModule } from '../firebase-admin/firebase-admin.module';
import { Notificaciones } from '../entities/Notificaciones';

@Module({

  imports:[
    FirebaseAdminModule,
    TypeOrmModule.forFeature([EmpresasInformacion, RegistroColaboradores, Usuarios, Dispositivos, Notificaciones]),
  ],
  
  controllers: [RegistroColaboradoresController],
  providers: [RegistroColaboradoresService, NotificacionesService],
})
export class RegistroColaboradoresModule {}
