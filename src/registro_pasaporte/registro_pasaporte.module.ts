import { Module } from '@nestjs/common';
import { RegistroPasaporteService } from './registro_pasaporte.service';
import { RegistroPasaporteController } from './registro_pasaporte.controller';
import { RegistroPasaporte } from '../entities/RegistroPasaporte';
import { CaracteristicasSucursales } from '../entities/CaracteristicasSucursales';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

  imports:[
    TypeOrmModule.forFeature([RegistroPasaporte, CaracteristicasSucursales]),
  ],

  controllers: [RegistroPasaporteController],
  providers: [RegistroPasaporteService],
})
export class RegistroPasaporteModule {}
