import { Module } from '@nestjs/common';
import { SucursalesAreasGruposFechasService } from './sucursales_areas_grupos_fechas.service';
import { SucursalesAreasGruposFechasController } from './sucursales_areas_grupos_fechas.controller';
import { SucursalesAreasGruposFechas } from '../entities/SucursalesAreasGruposFechas';
import { SucursalesAreasGruposInformacion } from '../entities/SucursalesAreasGruposInformacion';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';

@Module({

  imports:[
    TypeOrmModule.forFeature([SucursalesAreasGruposFechas, SucursalesAreasGruposInformacion, EmpresasInformacion]),
  ],

  controllers: [SucursalesAreasGruposFechasController],
  providers: [SucursalesAreasGruposFechasService],
})
export class SucursalesAreasGruposFechasModule {}
