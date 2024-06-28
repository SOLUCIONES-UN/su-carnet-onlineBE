import { Module } from '@nestjs/common';
import { TiposSucursalesService } from './tipos_sucursales.service';
import { TiposSucursalesController } from './tipos_sucursales.controller';
import { TipoSucursales } from '../entities/TipoSucursales';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

  imports:[
    TypeOrmModule.forFeature([TipoSucursales]),
  ],

  controllers: [TiposSucursalesController],
  providers: [TiposSucursalesService],
})
export class TiposSucursalesModule {}
