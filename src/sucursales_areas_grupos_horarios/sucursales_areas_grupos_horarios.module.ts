import { Module } from '@nestjs/common';
import { SucursalesAreasGruposHorariosService } from './sucursales_areas_grupos_horarios.service';
import { SucursalesAreasGruposHorariosController } from './sucursales_areas_grupos_horarios.controller';
import { SucursalesAreasGruposInformacion } from '../entities/SucursalesAreasGruposInformacion';
import { SucursalesAreasGruposHorarios } from '../entities/SucursalesAreasGruposHorarios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SucursalesInformacion } from '../entities/SucursalesInformacion';
import { SucursalesAreasPermisos } from '../entities/SucursalesAreasPermisos';

@Module({
  imports:[
    TypeOrmModule.forFeature([SucursalesAreasGruposHorarios, SucursalesAreasGruposInformacion, SucursalesInformacion, SucursalesAreasPermisos]),
  ],

  controllers: [SucursalesAreasGruposHorariosController],
  providers: [SucursalesAreasGruposHorariosService],
})
export class SucursalesAreasGruposHorariosModule {}
