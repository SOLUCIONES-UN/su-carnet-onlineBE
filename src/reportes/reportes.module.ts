import { Module } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { ReportesController } from './reportes.controller';
import { SucursalesAreasInformacion } from '../entities/SucursalesAreasInformacion';
import { SucursalesAreasPermisos } from '../entities/SucursalesAreasPermisos';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuarios } from '../entities/Usuarios';
import { SucursalesAreasGruposInformacion } from '../entities/SucursalesAreasGruposInformacion';

@Module({

  imports:[
    TypeOrmModule.forFeature([SucursalesAreasInformacion, SucursalesAreasPermisos, Usuarios, SucursalesAreasGruposInformacion]),
  ],

  controllers: [ReportesController],
  providers: [ReportesService],
})
export class ReportesModule {}
