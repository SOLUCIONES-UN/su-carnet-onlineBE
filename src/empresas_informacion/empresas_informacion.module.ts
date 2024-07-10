import { Module } from '@nestjs/common';
import { EmpresasInformacionService } from './empresas_informacion.service';
import { EmpresasInformacionController } from './empresas_informacion.controller';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendedores } from '../entities/Vendedores';
import { Usuarios } from '../entities/Usuarios';
import { RegistroAfiliaciones } from '../entities/RegistroAfiliaciones';

@Module({

  imports:[
    TypeOrmModule.forFeature([EmpresasInformacion, Vendedores, Usuarios, RegistroAfiliaciones]),
  ],

  controllers: [EmpresasInformacionController],
  providers: [EmpresasInformacionService],
})
export class EmpresasInformacionModule {}
