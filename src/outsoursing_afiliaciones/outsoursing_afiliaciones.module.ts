import { Module } from '@nestjs/common';
import { OutsoursingAfiliacionesService } from './outsoursing_afiliaciones.service';
import { OutsoursingAfiliacionesController } from './outsoursing_afiliaciones.controller';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { OutsoursingAfiliaciones } from '../entities/OutsoursingAfiliaciones';
import { OutsoursingInformacion } from '../entities/OutsoursingInformacion';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

  imports:[
    TypeOrmModule.forFeature([OutsoursingAfiliaciones, OutsoursingInformacion, RegistroInformacion]),
  ],

  controllers: [OutsoursingAfiliacionesController],
  providers: [OutsoursingAfiliacionesService],
})
export class OutsoursingAfiliacionesModule {}
