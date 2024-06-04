import { Module } from '@nestjs/common';
import { TipoCategoriasServiciosService } from './tipo_categorias_servicios.service';
import { TipoCategoriasServiciosController } from './tipo_categorias_servicios.controller';
import { TipoCategoriasServicios } from '../entities/TipoCategoriasServicios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoServicios } from '../entities/TipoServicios';

@Module({

  imports:[
    TypeOrmModule.forFeature([TipoCategoriasServicios, TipoServicios]),
  ],

  controllers: [TipoCategoriasServiciosController],
  providers: [TipoCategoriasServiciosService],
})
export class TipoCategoriasServiciosModule {}
