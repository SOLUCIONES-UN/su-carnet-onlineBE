import { Module } from '@nestjs/common';
import { RegistroMembresiaService } from './registro_membresia.service';
import { RegistroMembresiaController } from './registro_membresia.controller';
import { CaracteristicasSucursales } from '../entities/CaracteristicasSucursales';
import { RegistroMembresia } from '../entities/RegistroMembresia';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

  imports:[
    TypeOrmModule.forFeature([RegistroMembresia, CaracteristicasSucursales]),
  ],

  controllers: [RegistroMembresiaController],
  providers: [RegistroMembresiaService],
})
export class RegistroMembresiaModule {}
