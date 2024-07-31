import { Module } from '@nestjs/common';
import { SucursalesAreasLogsService } from './sucursales_areas_logs.service';
import { SucursalesAreasLogsController } from './sucursales_areas_logs.controller';
import { SucursalesAreasGruposPuertas } from '../entities/SucursalesAreasGruposPuertas';
import { SucursalesAreasLogs } from '../entities/SucursalesAreasLogs';
import { SucursalesAreasPermisos } from '../entities/SucursalesAreasPermisos';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseAdminModule } from '../firebase-admin/firebase-admin.module';
import { SucursalesAreasGruposInformacion } from '../entities/SucursalesAreasGruposInformacion';
import { SucursalesAreasInformacion } from '../entities/SucursalesAreasInformacion';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { Usuarios } from '../entities/Usuarios';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { Dispositivos } from '../entities/Dispositivos';
import { SucursalesAreasPermisosService } from '../sucursales_areas_permisos/sucursales_areas_permisos.service';

@Module({
  imports:[
    FirebaseAdminModule,
    TypeOrmModule.forFeature([SucursalesAreasLogs, SucursalesAreasPermisos, SucursalesAreasGruposPuertas, 
    SucursalesAreasGruposInformacion, SucursalesAreasInformacion, Usuarios, RegistroInformacion, Dispositivos]),
  ],

  controllers: [SucursalesAreasLogsController],
  providers: [SucursalesAreasLogsService, NotificacionesService],
})
export class SucursalesAreasLogsModule {}
