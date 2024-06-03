import { Module } from '@nestjs/common';
import { TipoCategoriasServiciosService } from './tipo_categorias_servicios.service';
import { TipoCategoriasServiciosController } from './tipo_categorias_servicios.controller';
import { TipoCategoriasServicios } from '../entities/TipoCategoriasServicios';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

  imports:[
    TypeOrmModule.forFeature([TipoCategoriasServicios]),
  ],

  controllers: [TipoCategoriasServiciosController],
  providers: [TipoCategoriasServiciosService],
})
export class TipoCategoriasServiciosModule {}
