import { Module } from '@nestjs/common';
import { TipoRelacionEmpresasService } from './tipo_relacion_empresas.service';
import { TipoRelacionEmpresasController } from './tipo_relacion_empresas.controller';
import { TipoRelacionEmpresas } from '../entities/TipoRelacionEmpresas';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

  imports:[
    TypeOrmModule.forFeature([TipoRelacionEmpresas]),
  ],

  controllers: [TipoRelacionEmpresasController],
  providers: [TipoRelacionEmpresasService],
})
export class TipoRelacionEmpresasModule {}
