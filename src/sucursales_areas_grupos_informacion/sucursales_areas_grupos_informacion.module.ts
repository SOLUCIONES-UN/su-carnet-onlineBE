import { Module } from '@nestjs/common';
import { SucursalesAreasGruposInformacionService } from './sucursales_areas_grupos_informacion.service';
import { SucursalesAreasGruposInformacionController } from './sucursales_areas_grupos_informacion.controller';
import { SucursalesAreasGruposInformacion } from '../entities/SucursalesAreasGruposInformacion';
import { SucursalesAreasInformacion } from '../entities/SucursalesAreasInformacion';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

  imports:[
    TypeOrmModule.forFeature([SucursalesAreasGruposInformacion, SucursalesAreasInformacion]),
  ],


  controllers: [SucursalesAreasGruposInformacionController],
  providers: [SucursalesAreasGruposInformacionService],
})
export class SucursalesAreasGruposInformacionModule {}
