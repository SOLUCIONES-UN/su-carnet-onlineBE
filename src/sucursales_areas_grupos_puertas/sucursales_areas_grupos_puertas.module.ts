import { Module } from '@nestjs/common';
import { SucursalesAreasGruposPuertasService } from './sucursales_areas_grupos_puertas.service';
import { SucursalesAreasGruposPuertasController } from './sucursales_areas_grupos_puertas.controller';
import { SucursalesAreasGruposInformacion } from '../entities/SucursalesAreasGruposInformacion';
import { SucursalesAreasGruposPuertas } from '../entities/SucursalesAreasGruposPuertas';
import { SucursalesAreasPuertas } from '../entities/SucursalesAreasPuertas';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';

@Module({
  imports:[
    TypeOrmModule.forFeature([SucursalesAreasPuertas, SucursalesAreasGruposPuertas, SucursalesAreasGruposInformacion, EmpresasInformacion]),
  ],

  controllers: [SucursalesAreasGruposPuertasController],
  providers: [SucursalesAreasGruposPuertasService],
})
export class SucursalesAreasGruposPuertasModule {}
