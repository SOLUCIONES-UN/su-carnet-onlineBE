import { Module } from '@nestjs/common';
import { OutsoursingDocumentosService } from './outsoursing_documentos.service';
import { OutsoursingDocumentosController } from './outsoursing_documentos.controller';
import { OutsoursingInformacion } from '../entities/OutsoursingInformacion';
import { OutsoursingDocumentos } from '../entities/OutsoursingDocumentos';
import { RegistroDocumentos } from '../entities/RegistroDocumentos';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

  imports:[
    TypeOrmModule.forFeature([OutsoursingDocumentos, RegistroDocumentos, OutsoursingInformacion]),
  ],

  controllers: [OutsoursingDocumentosController],
  providers: [OutsoursingDocumentosService],
})
export class OutsoursingDocumentosModule {}
