import { Module } from '@nestjs/common';
import { TipoServiciosService } from './tipo_servicios.service';
import { TipoServiciosController } from './tipo_servicios.controller';
import { TipoCategoriasServicios } from '../entities/TipoCategoriasServicios';
import { TipoServicios } from '../entities/TipoServicios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';

@Module({
  imports:[
    TypeOrmModule.forFeature([TipoCategoriasServicios, TipoServicios, EmpresasInformacion]),
  ],
  
  controllers: [TipoServiciosController],
  providers: [TipoServiciosService],
})
export class TipoServiciosModule {}
