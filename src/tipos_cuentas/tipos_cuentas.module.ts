import { Module } from '@nestjs/common';
import { TiposCuentasService } from './tipos_cuentas.service';
import { TiposCuentasController } from './tipos_cuentas.controller';
import { Tiposcuentas } from '../entities/Tiposcuentas';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

  imports:[
    TypeOrmModule.forFeature([Tiposcuentas]),
  ],

  controllers: [TiposCuentasController],
  providers: [TiposCuentasService],
})
export class TiposCuentasModule {}
