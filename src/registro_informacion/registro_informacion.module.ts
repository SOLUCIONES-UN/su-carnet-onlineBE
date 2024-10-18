import { Module } from '@nestjs/common';
import { RegistroInformacionService } from './registro_informacion.service';
import { RegistroInformacionController } from './registro_informacion.controller';
import { TipoPaises } from '../entities/TipoPaises';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuarios } from '../entities/Usuarios';
import { UsuariosService } from '../usuarios/usuarios.service';
import { TipoUsuario } from '../entities/TipoUsuario';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { SucursalesInformacion } from '../entities/SucursalesInformacion';
import { SucursalesAreasInformacion } from '../entities/SucursalesAreasInformacion';
import { Municipios } from '../entities/Municipios';
import { Roles } from '../entities/Roles';
import { Participaciones } from '../entities/Participaciones';
import { RespuestasUsuariosConcursos } from '../entities/RespuestasUsuariosConcursos';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RegistroInformacion,
      TipoPaises,
      Usuarios,
      TipoUsuario,
      Municipios,
      EmpresasInformacion,
      SucursalesInformacion,
      SucursalesAreasInformacion,
      Roles,
      Participaciones,
      RespuestasUsuariosConcursos,
    ]),
  ],
  controllers: [RegistroInformacionController],
  providers: [RegistroInformacionService, UsuariosService],
})
export class RegistroInformacionModule {}
