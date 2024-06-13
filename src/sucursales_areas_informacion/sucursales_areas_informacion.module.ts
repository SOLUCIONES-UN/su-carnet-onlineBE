import { Module } from '@nestjs/common';
import { SucursalesAreasInformacionService } from './sucursales_areas_informacion.service';
import { SucursalesAreasInformacionController } from './sucursales_areas_informacion.controller';
import { SucursalesAreasInformacion } from '../entities/SucursalesAreasInformacion';
import { SucursalesInformacion } from '../entities/SucursalesInformacion';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

  imports:[
    TypeOrmModule.forFeature([SucursalesInformacion, SucursalesAreasInformacion]),
  ],

  controllers: [SucursalesAreasInformacionController],
  providers: [SucursalesAreasInformacionService],
})
export class SucursalesAreasInformacionModule {}