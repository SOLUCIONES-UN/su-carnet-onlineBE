import { Module } from '@nestjs/common';
import { SucursalesDocumentosService } from './sucursales_documentos.service';
import { SucursalesDocumentosController } from './sucursales_documentos.controller';
import { SucursalesInformacion } from '../entities/SucursalesInformacion';
import { SucursalesDocumentos } from '../entities/SucursalesDocumentos';
import { TipoDocumentos } from '../entities/TipoDocumentos';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';

@Module({
  imports:[
    TypeOrmModule.forFeature([SucursalesInformacion, SucursalesDocumentos, TipoDocumentos, EmpresasInformacion]),
  ],
  controllers: [SucursalesDocumentosController],
  providers: [SucursalesDocumentosService],
})
export class SucursalesDocumentosModule {}
