import { Module } from '@nestjs/common';
import { MembresiaInformacionService } from './membresia_informacion.service';
import { MembresiaInformacionController } from './membresia_informacion.controller';
import { MembresiaInformacion } from '../entities/MembresiaInformacion';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

  imports:[
    TypeOrmModule.forFeature([MembresiaInformacion]),
  ],

  controllers: [MembresiaInformacionController],
  providers: [MembresiaInformacionService],
})
export class MembresiaInformacionModule {}
