import { Module } from '@nestjs/common';
import { RegistroMembresiasService } from './registro_membresias.service';
import { RegistroMembresiasController } from './registro_membresias.controller';
import { RegistroMembresia } from '../entities/RegistroMembresia';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembresiaInformacion } from '../entities/MembresiaInformacion';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { Usuarios } from '../entities/Usuarios';

@Module({

  imports:[
    TypeOrmModule.forFeature([RegistroMembresia, MembresiaInformacion, RegistroInformacion, Usuarios]),
  ],
  
  controllers: [RegistroMembresiasController],
  providers: [RegistroMembresiasService],
})
export class RegistroMembresiasModule {}
