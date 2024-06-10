import { Module } from '@nestjs/common';
import { EmpresasMensajesService } from './empresas_mensajes.service';
import { EmpresasMensajesController } from './empresas_mensajes.controller';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { EmpresasMensajes } from '../entities/EmpresasMensajes';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

  imports:[
    TypeOrmModule.forFeature([EmpresasMensajes, EmpresasInformacion]),
  ],

  controllers: [EmpresasMensajesController],
  providers: [EmpresasMensajesService],
})
export class EmpresasMensajesModule {}
