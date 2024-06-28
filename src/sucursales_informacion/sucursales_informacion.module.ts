import { Module } from '@nestjs/common';
import { SucursalesInformacionService } from './sucursales_informacion.service';
import { SucursalesInformacionController } from './sucursales_informacion.controller';
import { SucursalesInformacion } from '../entities/SucursalesInformacion';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { TipoSucursales } from '../entities/TipoSucursales';

@Module({

  imports:[
    TypeOrmModule.forFeature([SucursalesInformacion, EmpresasInformacion, TipoSucursales]),
  ],

  controllers: [SucursalesInformacionController],
  providers: [SucursalesInformacionService],
})
export class SucursalesInformacionModule {}
