import { Module } from '@nestjs/common';
import { SucursalesInformacionService } from './sucursales_informacion.service';
import { SucursalesInformacionController } from './sucursales_informacion.controller';
import { SucursalesInformacion } from '../entities/SucursalesInformacion';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';

@Module({

  imports:[
    TypeOrmModule.forFeature([SucursalesInformacion, EmpresasInformacion]),
  ],

  controllers: [SucursalesInformacionController],
  providers: [SucursalesInformacionService],
})
export class SucursalesInformacionModule {}
