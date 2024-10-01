import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuarios } from '../entities/Usuarios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoUsuario } from '../entities/TipoUsuario';
import { Otps } from '../entities/Otps';
import { VerificacionUsuariosService } from '../verificacion_usuarios/verificacion_usuarios.service';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { ConfigModule } from '@nestjs/config';
import { SucursalesInformacion } from '../entities/SucursalesInformacion';
import { SucursalesAreasInformacion } from '../entities/SucursalesAreasInformacion';
import { Roles } from '../entities/Roles';
import { Permisosopciones } from '../entities/Permisosopciones';
import { Menusprincipales } from '../entities/Menusprincipales';
import { Opcionesmenu } from '../entities/Opcionesmenu';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { Notificaciones } from '../entities/Notificaciones';

@Module({

  imports:[
    TypeOrmModule.forFeature([Usuarios, EmpresasInformacion, TipoUsuario, Otps, SucursalesInformacion, SucursalesAreasInformacion, Roles,
      Permisosopciones, Menusprincipales, Opcionesmenu, SucursalesAreasInformacion, RegistroInformacion, Notificaciones
    ]),
    ConfigModule
  ],

  controllers: [UsuariosController],
  providers: [UsuariosService, VerificacionUsuariosService],
})
export class UsuariosModule {}
