import { Module } from '@nestjs/common';
import { RegistroAfiliacionesService } from './registro_afiliaciones.service';
import { RegistroAfiliacionesController } from './registro_afiliaciones.controller';
import { RegistroAfiliaciones } from '../entities/RegistroAfiliaciones';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[
    TypeOrmModule.forFeature([EmpresasInformacion, RegistroAfiliaciones]),
  ],

  controllers: [RegistroAfiliacionesController],
  providers: [RegistroAfiliacionesService],
})
export class RegistroAfiliacionesModule {}
