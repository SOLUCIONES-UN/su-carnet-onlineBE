import { Module } from '@nestjs/common';
import { TipoPaisesService } from './tipo_paises.service';
import { TipoPaisesController } from './tipo_paises.controller';
import { TipoPaises } from '../entities/TipoPaises';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

  imports:[
    TypeOrmModule.forFeature([TipoPaises]),
  ],

  controllers: [TipoPaisesController],
  providers: [TipoPaisesService],
})
export class TipoPaisesModule {}
