import { Module } from '@nestjs/common';
import { RegistroColaboradoresService } from './registro-colaboradores.service';
import { RegistroColaboradoresController } from './registro-colaboradores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { Usuarios } from '../entities/Usuarios';
import { RegistroColaboradores } from '../entities/RegistroColaboradores';

@Module({

  imports:[
    TypeOrmModule.forFeature([EmpresasInformacion, RegistroColaboradores, Usuarios]),
  ],
  
  controllers: [RegistroColaboradoresController],
  providers: [RegistroColaboradoresService],
})
export class RegistroColaboradoresModule {}
