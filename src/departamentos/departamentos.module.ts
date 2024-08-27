import { Module } from '@nestjs/common';
import { DepartamentosService } from './departamentos.service';
import { DepartamentosController } from './departamentos.controller';
import { Departamentos } from '../entities/Departamentos';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoPaises } from '../entities/TipoPaises';
import { Municipios } from '../entities/Municipios';

@Module({

  imports:[
    TypeOrmModule.forFeature([Departamentos, TipoPaises, Municipios]),
  ],
  controllers: [DepartamentosController],
  providers: [DepartamentosService],
})
export class DepartamentosModule {}
