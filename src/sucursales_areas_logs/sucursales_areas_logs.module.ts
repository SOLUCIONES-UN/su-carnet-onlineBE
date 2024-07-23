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

@Module({
  imports:[
    // FirebaseAdminModule,
    TypeOrmModule.forFeature([SucursalesAreasLogs, SucursalesAreasPermisos, SucursalesAreasGruposPuertas, SucursalesAreasGruposInformacion, SucursalesAreasInformacion]),
  ],

  controllers: [SucursalesAreasLogsController],
  providers: [SucursalesAreasLogsService],
})
export class SucursalesAreasLogsModule {}
