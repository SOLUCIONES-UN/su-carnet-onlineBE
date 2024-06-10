import { Module } from '@nestjs/common';
import { RegistroMensajesService } from './registro_mensajes.service';
import { RegistroMensajesController } from './registro_mensajes.controller';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { RegistroMensajes } from '../entities/RegistroMensajes';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresasMensajes } from '../entities/EmpresasMensajes';

@Module({

  imports:[
    TypeOrmModule.forFeature([RegistroMensajes, RegistroInformacion, EmpresasMensajes]),
  ],

  controllers: [RegistroMensajesController],
  providers: [RegistroMensajesService],
})
export class RegistroMensajesModule {}
