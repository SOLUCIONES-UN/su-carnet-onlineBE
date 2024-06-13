import { Module } from '@nestjs/common';
import { RegistroDocumentosService } from './registro_documentos.service';
import { RegistroDocumentosController } from './registro_documentos.controller';
import { TipoDocumentos } from '../entities/TipoDocumentos';
import { RegistroDocumentos } from '../entities/RegistroDocumentos';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuarios } from '../entities/Usuarios';

@Module({

  imports:[
    TypeOrmModule.forFeature([RegistroDocumentos, RegistroInformacion, TipoDocumentos, Usuarios]),
  ],

  controllers: [RegistroDocumentosController],
  providers: [RegistroDocumentosService],
})
export class RegistroDocumentosModule {}
