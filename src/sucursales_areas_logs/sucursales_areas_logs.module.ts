import { Module } from '@nestjs/common';
import { SucursalesAreasLogsService } from './sucursales_areas_logs.service';
import { SucursalesAreasLogsController } from './sucursales_areas_logs.controller';
import { SucursalesAreasGruposPuertas } from '../entities/SucursalesAreasGruposPuertas';
import { SucursalesAreasLogs } from '../entities/SucursalesAreasLogs';
import { SucursalesAreasPermisos } from '../entities/SucursalesAreasPermisos';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[
    TypeOrmModule.forFeature([SucursalesAreasLogs, SucursalesAreasPermisos, SucursalesAreasGruposPuertas]),
  ],

  controllers: [SucursalesAreasLogsController],
  providers: [SucursalesAreasLogsService],
})
export class SucursalesAreasLogsModule {}
