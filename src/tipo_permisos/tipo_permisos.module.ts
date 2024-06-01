import { Module } from '@nestjs/common';
import { TipoPermisosService } from './tipo_permisos.service';
import { TipoPermisosController } from './tipo_permisos.controller';
import { TipoPermisos } from '../entities/TipoPermisos';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

  imports:[
    TypeOrmModule.forFeature([TipoPermisos]),
  ],

  controllers: [TipoPermisosController],
  providers: [TipoPermisosService],
})
export class TipoPermisosModule {}
