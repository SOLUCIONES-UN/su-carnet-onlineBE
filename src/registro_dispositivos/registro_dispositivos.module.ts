import { Module } from '@nestjs/common';
import { RegistroDispositivosService } from './registro_dispositivos.service';
import { RegistroDispositivosController } from './registro_dispositivos.controller';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { RegistroDispositivos } from '../entities/RegistroDispositivos';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

  imports:[
    TypeOrmModule.forFeature([RegistroDispositivos, RegistroInformacion]),
  ],

  controllers: [RegistroDispositivosController],
  providers: [RegistroDispositivosService],
})
export class RegistroDispositivosModule {}
