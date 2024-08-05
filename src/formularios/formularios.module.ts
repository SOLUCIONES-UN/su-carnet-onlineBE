import { Module } from '@nestjs/common';
import { FormulariosService } from './formularios.service';
import { FormulariosController } from './formularios.controller';
import { Formularios } from '../entities/Formularios';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

  imports:[
    TypeOrmModule.forFeature([Formularios]),
  ],

  controllers: [FormulariosController],
  providers: [FormulariosService],
})
export class FormulariosModule {}
