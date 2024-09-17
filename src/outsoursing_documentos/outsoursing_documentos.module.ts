import { Module } from '@nestjs/common';
import { OutsoursingDocumentosService } from './outsoursing_documentos.service';
import { OutsoursingDocumentosController } from './outsoursing_documentos.controller';
import { OutsoursingInformacion } from '../entities/OutsoursingInformacion';
import { OutsoursingDocumentos } from '../entities/OutsoursingDocumentos';
import { RegistroDocumentos } from '../entities/RegistroDocumentos';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { EmpresasDocumentos } from '../entities/EmpresasDocumentos';

@Module({

  imports:[
    TypeOrmModule.forFeature([OutsoursingDocumentos, RegistroDocumentos, OutsoursingInformacion, EmpresasInformacion, EmpresasDocumentos]),
  ],

  controllers: [OutsoursingDocumentosController],
  providers: [OutsoursingDocumentosService],
})
export class OutsoursingDocumentosModule {}
