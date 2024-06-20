import { Module } from '@nestjs/common';
import { RegistroInformacionService } from './registro_informacion.service';
import { RegistroInformacionController } from './registro_informacion.controller';
import { TipoPaises } from '../entities/TipoPaises';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuarios } from '../entities/Usuarios';

@Module({
  imports:[
    TypeOrmModule.forFeature([RegistroInformacion, TipoPaises, Usuarios]),
  ],
  controllers: [RegistroInformacionController],
  providers: [RegistroInformacionService],
})
export class RegistroInformacionModule {}
