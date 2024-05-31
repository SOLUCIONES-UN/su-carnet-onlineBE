import { Module } from '@nestjs/common';
import { SucursalesAreasPuertasService } from './sucursales_areas_puertas.service';
import { SucursalesAreasPuertasController } from './sucursales_areas_puertas.controller';
import { SucursalesAreasPuertas } from '../entities/SucursalesAreasPuertas';
import { SucursalesAreasInformacion } from '../entities/SucursalesAreasInformacion';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

  imports:[
    TypeOrmModule.forFeature([SucursalesAreasPuertas, SucursalesAreasInformacion]),
  ],

  controllers: [SucursalesAreasPuertasController],
  providers: [SucursalesAreasPuertasService],
})
export class SucursalesAreasPuertasModule {}
