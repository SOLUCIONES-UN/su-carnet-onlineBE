import { Module } from '@nestjs/common';
import { SucursalesAreasPermisosService } from './sucursales_areas_permisos.service';
import { SucursalesAreasPermisosController } from './sucursales_areas_permisos.controller';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { SucursalesAreasPermisos } from '../entities/SucursalesAreasPermisos';
import { SucursalesAreasGruposInformacion } from '../entities/SucursalesAreasGruposInformacion';
import { TipoPermisos } from '../entities/TipoPermisos';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

  imports:[
    TypeOrmModule.forFeature([SucursalesAreasPermisos, SucursalesAreasGruposInformacion, TipoPermisos, RegistroInformacion]),
  ],

  controllers: [SucursalesAreasPermisosController],
  providers: [SucursalesAreasPermisosService],
})
export class SucursalesAreasPermisosModule {}