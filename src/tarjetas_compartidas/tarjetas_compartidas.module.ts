import { Module } from '@nestjs/common';
import { TarjetasCompartidasService } from './tarjetas_compartidas.service';
import { TarjetasCompartidasController } from './tarjetas_compartidas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tarjetascompartidas } from '../entities/Tarjetascompartidas';
import { TarjetaPresentacion } from '../entities/TarjetaPresentacion';
import { Usuarios } from '../entities/Usuarios';
import { RegistroInformacion } from '../entities/RegistroInformacion';

@Module({

  imports:[
    TypeOrmModule.forFeature([Tarjetascompartidas, TarjetaPresentacion, Usuarios, RegistroInformacion]),
  ],

  controllers: [TarjetasCompartidasController],
  providers: [TarjetasCompartidasService],
})
export class TarjetasCompartidasModule {}