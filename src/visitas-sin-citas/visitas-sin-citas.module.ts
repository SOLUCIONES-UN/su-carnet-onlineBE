import { Module } from '@nestjs/common';
import { VisitasSinCitasService } from './visitas-sin-citas.service';
import { VisitasSinCitasController } from './visitas-sin-citas.controller';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Municipios } from '../entities/Municipios';
import { Usuarios } from '../entities/Usuarios';
import { TipoUsuario } from '../entities/TipoUsuario';
import { LogVisitasSinCitas } from '../entities/LogVisitasSinCitas';

@Module({
  imports:[
    TypeOrmModule.forFeature([RegistroInformacion, Municipios, Usuarios, TipoUsuario, LogVisitasSinCitas]),
  ],

  controllers: [VisitasSinCitasController],
  providers: [VisitasSinCitasService],
})
export class VisitasSinCitasModule {}
