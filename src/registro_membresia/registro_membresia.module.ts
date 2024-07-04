import { Module } from '@nestjs/common';
import { RegistroMembresiaService } from './registro_membresia.service';
import { RegistroMembresiaController } from './registro_membresia.controller';
import { RegistroMembresia } from '../entities/RegistroMembresia';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembresiaInformacion } from '../entities/MembresiaInformacion';
import { RegistroInformacion } from '../entities/RegistroInformacion';

@Module({

  imports:[
    TypeOrmModule.forFeature([RegistroMembresia, MembresiaInformacion, RegistroInformacion]),
  ],

  controllers: [RegistroMembresiaController],
  providers: [RegistroMembresiaService],
})
export class RegistroMembresiaModule {}
