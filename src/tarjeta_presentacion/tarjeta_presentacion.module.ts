import { Module } from '@nestjs/common';
import { TarjetaPresentacionService } from './tarjeta_presentacion.service';
import { TarjetaPresentacionController } from './tarjeta_presentacion.controller';
import { TarjetaPresentacion } from '../entities/TarjetaPresentacion';
import { Usuarios } from '../entities/Usuarios';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

  imports:[
    TypeOrmModule.forFeature([TarjetaPresentacion, EmpresasInformacion, Usuarios]),
  ],

  controllers: [TarjetaPresentacionController],
  providers: [TarjetaPresentacionService],
})
export class TarjetaPresentacionModule {}
