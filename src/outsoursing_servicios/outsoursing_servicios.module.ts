import { Module } from '@nestjs/common';
import { OutsoursingServiciosService } from './outsoursing_servicios.service';
import { OutsoursingServiciosController } from './outsoursing_servicios.controller';
import { TipoServicios } from '../entities/TipoServicios';
import { OutsoursingServicios } from '../entities/OutsoursingServicios';
import { OutsoursingInformacion } from '../entities/OutsoursingInformacion';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

  imports:[
    TypeOrmModule.forFeature([OutsoursingServicios, OutsoursingInformacion, TipoServicios]),
  ],

  controllers: [OutsoursingServiciosController],
  providers: [OutsoursingServiciosService],
})
export class OutsoursingServiciosModule {}
