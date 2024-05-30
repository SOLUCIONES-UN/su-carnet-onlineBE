import { Module } from '@nestjs/common';
import { VendedoresService } from './vendedores.service';
import { VendedoresController } from './vendedores.controller';
import { Vendedores } from '../entities/Vendedores';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { SucursalesInformacion } from '../entities/SucursalesInformacion';
import { SucursalesAreasInformacion } from '../entities/SucursalesAreasInformacion';
import { SucursalesAreasGruposInformacion } from '../entities/SucursalesAreasGruposInformacion';
import { SucursalesAreasPuertas } from '../entities/SucursalesAreasPuertas';

@Module({

  imports:[
    TypeOrmModule.forFeature([Vendedores, EmpresasInformacion, SucursalesInformacion, SucursalesAreasInformacion, SucursalesAreasInformacion, SucursalesAreasGruposInformacion,
      SucursalesAreasPuertas
    ]),
  ],

  controllers: [VendedoresController],
  providers: [VendedoresService],
})
export class VendedoresModule {}
