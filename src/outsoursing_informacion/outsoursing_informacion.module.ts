import { Module } from '@nestjs/common';
import { OutsoursingInformacionService } from './outsoursing_informacion.service';
import { OutsoursingInformacionController } from './outsoursing_informacion.controller';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { OutsoursingInformacion } from '../entities/OutsoursingInformacion';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

  imports:[
    TypeOrmModule.forFeature([OutsoursingInformacion, EmpresasInformacion]),
  ],

  controllers: [OutsoursingInformacionController],
  providers: [OutsoursingInformacionService],
})
export class OutsoursingInformacionModule {}
