import { Module } from '@nestjs/common';
import { MunicipiosService } from './municipios.service';
import { MunicipiosController } from './municipios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Departamentos } from '../entities/Departamentos';
import { Municipios } from '../entities/Municipios';

@Module({

  
  imports:[
    TypeOrmModule.forFeature([Departamentos, Municipios]),
  ],
  
  controllers: [MunicipiosController],
  providers: [MunicipiosService],
})
export class MunicipiosModule {}
