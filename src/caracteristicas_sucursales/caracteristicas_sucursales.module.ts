import { Module } from '@nestjs/common';
import { CaracteristicasSucursalesService } from './caracteristicas_sucursales.service';
import { CaracteristicasSucursalesController } from './caracteristicas_sucursales.controller';
import { CaracteristicasSucursales } from '../entities/CaracteristicasSucursales';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

  imports:[
    TypeOrmModule.forFeature([CaracteristicasSucursales]),
  ],

  controllers: [CaracteristicasSucursalesController],
  providers: [CaracteristicasSucursalesService],
})
export class CaracteristicasSucursalesModule {}
