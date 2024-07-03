import { Module } from '@nestjs/common';
import { TiposMembresiasService } from './tipos_membresias.service';
import { TiposMembresiasController } from './tipos_membresias.controller';
import { TipoMembresia } from '../entities/TipoMembresia';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

  imports:[
    TypeOrmModule.forFeature([TipoMembresia]),
  ],

  controllers: [TiposMembresiasController],
  providers: [TiposMembresiasService],
})
export class TiposMembresiasModule {}
