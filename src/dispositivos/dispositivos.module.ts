import { Module } from '@nestjs/common';
import { DispositivosService } from './dispositivos.service';
import { DispositivosController } from './dispositivos.controller';
import { Dispositivos } from '../entities/Dispositivos';
import { Usuarios } from '../entities/Usuarios';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

  imports:[
    TypeOrmModule.forFeature([Dispositivos, Usuarios]),
  ],
  controllers: [DispositivosController],
  providers: [DispositivosService],
})
export class DispositivosModule {}
