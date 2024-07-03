import { Module } from '@nestjs/common';
import { MembresiaInformacionService } from './membresia_informacion.service';
import { MembresiaInformacionController } from './membresia_informacion.controller';
import { MembresiaInformacion } from '../entities/MembresiaInformacion';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { TipoMembresia } from '../entities/TipoMembresia';

@Module({

  imports:[
    TypeOrmModule.forFeature([MembresiaInformacion, EmpresasInformacion, TipoMembresia]),
  ],

  controllers: [MembresiaInformacionController],
  providers: [MembresiaInformacionService],
})
export class MembresiaInformacionModule {}
