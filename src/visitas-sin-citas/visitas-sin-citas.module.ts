import { Module } from '@nestjs/common';
import { VisitasSinCitasService } from './visitas-sin-citas.service';
import { VisitasSinCitasController } from './visitas-sin-citas.controller';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[
    TypeOrmModule.forFeature([RegistroInformacion]),
  ],

  controllers: [VisitasSinCitasController],
  providers: [VisitasSinCitasService],
})
export class VisitasSinCitasModule {}
