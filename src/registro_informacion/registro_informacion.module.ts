import { Module } from '@nestjs/common';
import { RegistroInformacionService } from './registro_informacion.service';
import { RegistroInformacionController } from './registro_informacion.controller';
import { TipoPaises } from '../entities/TipoPaises';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[
    TypeOrmModule.forFeature([RegistroInformacion, TipoPaises]),
  ],
  controllers: [RegistroInformacionController],
  providers: [RegistroInformacionService],
})
export class RegistroInformacionModule {}
