import { Module } from '@nestjs/common';
import { AreasSucursalesDocumentosService } from './areas_sucursales_documentos.service';
import { AreasSucursalesDocumentosController } from './areas_sucursales_documentos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SucursalesAreasInformacion } from '../entities/SucursalesAreasInformacion';
import { AreasSucursalesDocumentos } from '../entities/AreasSucursalesDocumentos';
import { TipoDocumentos } from '../entities/TipoDocumentos';

@Module({

  imports:[
    TypeOrmModule.forFeature([SucursalesAreasInformacion, AreasSucursalesDocumentos, TipoDocumentos]),
  ],
  
  controllers: [AreasSucursalesDocumentosController],
  providers: [AreasSucursalesDocumentosService],
})
export class AreasSucursalesDocumentosModule {}
