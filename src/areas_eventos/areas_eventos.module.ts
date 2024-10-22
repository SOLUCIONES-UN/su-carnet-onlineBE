import { Module } from '@nestjs/common';
import { AreasEventosService } from './areas_eventos.service';
import { AreasEventosController } from './areas_eventos.controller';
import { AreasEventos } from '../entities/AreasEventos';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';

@Module({
  imports: [
    // Import the TypeOrmModule to use it in the AreasEventosService
    TypeOrmModule.forFeature([AreasEventos, EmpresasInformacion]),
  ],

  controllers: [AreasEventosController],
  providers: [AreasEventosService],
})
export class AreasEventosModule {}
