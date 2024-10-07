import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Roles } from '../entities/Roles';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';

@Module({

  imports:[
    TypeOrmModule.forFeature([Roles, EmpresasInformacion]),
  ], 

  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
