import { Module } from '@nestjs/common';
import { AreasSucursalesDocumentosService } from './areas_sucursales_documentos.service';
import { AreasSucursalesDocumentosController } from './areas_sucursales_documentos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SucursalesAreasInformacion } from '../entities/SucursalesAreasInformacion';
import { AreasSucursalesDocumentos } from '../entities/AreasSucursalesDocumentos';
import { TipoDocumentos } from '../entities/TipoDocumentos';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { SucursalesInformacion } from '../entities/SucursalesInformacion';

@Module({

  imports:[
    TypeOrmModule.forFeature([SucursalesAreasInformacion, AreasSucursalesDocumentos, TipoDocumentos, SucursalesInformacion, EmpresasInformacion]),
  ],
  
  controllers: [AreasSucursalesDocumentosController],
  providers: [AreasSucursalesDocumentosService],
})
export class AreasSucursalesDocumentosModule {}
