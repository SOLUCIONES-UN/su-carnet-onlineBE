import { Module } from '@nestjs/common';
import { TipoDocumentosService } from './tipo-documentos.service';
import { TipoDocumentosController } from './tipo-documentos.controller';
import { TipoDocumentos } from '../entities/TipoDocumentos';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

  imports:[
    TypeOrmModule.forFeature([TipoDocumentos]),
  ],

  controllers: [TipoDocumentosController],
  providers: [TipoDocumentosService],
})
export class TipoDocumentosModule {}
