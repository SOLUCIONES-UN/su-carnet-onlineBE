import { Module } from '@nestjs/common';
import { EmpresasDocumentosService } from './empresas_documentos.service';
import { EmpresasDocumentosController } from './empresas_documentos.controller';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoDocumentos } from '../entities/TipoDocumentos';
import { EmpresasDocumentos } from '../entities/EmpresasDocumentos';

@Module({

  imports:[
    TypeOrmModule.forFeature([EmpresasInformacion, EmpresasDocumentos, TipoDocumentos]),
  ],

  controllers: [EmpresasDocumentosController],
  providers: [EmpresasDocumentosService],
})
export class EmpresasDocumentosModule {}
