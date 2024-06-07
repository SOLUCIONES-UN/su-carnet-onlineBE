import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestModule } from './test/test.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { TiposUsuarioModule } from './tipos_usuario/tipos_usuario.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { VerificacionUsuariosModule } from './verificacion_usuarios/verificacion_usuarios.module';
import { VendedoresModule } from './vendedores/vendedores.module';
import { EmpresasInformacionModule } from './empresas_informacion/empresas_informacion.module';
import { SucursalesInformacionModule } from './sucursales_informacion/sucursales_informacion.module';
import { SucursalesAreasInformacionModule } from './sucursales_areas_informacion/sucursales_areas_informacion.module';
import { SucursalesAreasPuertasModule } from './sucursales_areas_puertas/sucursales_areas_puertas.module';
import { SucursalesAreasGruposInformacionModule } from './sucursales_areas_grupos_informacion/sucursales_areas_grupos_informacion.module';
import { TipoDocumentosModule } from './tipo-documentos/tipo-documentos.module';
import { TipoPaisesModule } from './tipo_paises/tipo_paises.module';
import { TipoPermisosModule } from './tipo_permisos/tipo_permisos.module';
import { TipoCategoriasServiciosModule } from './tipo_categorias_servicios/tipo_categorias_servicios.module';
import { TipoServiciosModule } from './tipo_servicios/tipo_servicios.module';
import { EmpresasDocumentosModule } from './empresas_documentos/empresas_documentos.module';
import { SucursalesDocumentosModule } from './sucursales_documentos/sucursales_documentos.module';
import { RegistroAfiliacionesModule } from './registro_afiliaciones/registro_afiliaciones.module';
import { SucursalesAreasGruposPuertasModule } from './sucursales_areas_grupos_puertas/sucursales_areas_grupos_puertas.module';
import { SucursalesAreasGruposHorariosModule } from './sucursales_areas_grupos_horarios/sucursales_areas_grupos_horarios.module';
import { SucursalesAreasGruposFechasModule } from './sucursales_areas_grupos_fechas/sucursales_areas_grupos_fechas.module';
import { RegistroInformacionModule } from './registro_informacion/registro_informacion.module';
import { SucursalesAreasPermisosModule } from './sucursales_areas_permisos/sucursales_areas_permisos.module';
import { SucursalesAreasLogsModule } from './sucursales_areas_logs/sucursales_areas_logs.module';
import { RegistroDocumentosModule } from './registro_documentos/registro_documentos.module';
import { OutsoursingInformacionModule } from './outsoursing_informacion/outsoursing_informacion.module';
import { OutsoursingServiciosModule } from './outsoursing_servicios/outsoursing_servicios.module';
import { OutsoursingAfiliacionesModule } from './outsoursing_afiliaciones/outsoursing_afiliaciones.module';
import { OutsoursingDocumentosModule } from './outsoursing_documentos/outsoursing_documentos.module';

@Module({
  imports: [

    
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: false,
    }),

    TestModule,

    CommonModule,

    AuthModule,

    TiposUsuarioModule,

    UsuariosModule,

    VerificacionUsuariosModule,

    VendedoresModule,

    EmpresasInformacionModule,

    SucursalesInformacionModule,

    SucursalesAreasInformacionModule,

    SucursalesAreasPuertasModule,

    SucursalesAreasGruposInformacionModule,

    TipoDocumentosModule,

    TipoPaisesModule,

    TipoPermisosModule,

    TipoCategoriasServiciosModule,

    TipoServiciosModule,

    EmpresasDocumentosModule,

    SucursalesDocumentosModule,

    RegistroAfiliacionesModule,

    SucursalesAreasGruposPuertasModule,

    SucursalesAreasGruposHorariosModule,

    SucursalesAreasGruposFechasModule,

    RegistroInformacionModule,

    SucursalesAreasPermisosModule,

    SucursalesAreasLogsModule,

    RegistroDocumentosModule,

    OutsoursingInformacionModule,

    OutsoursingServiciosModule,

    OutsoursingAfiliacionesModule,

    OutsoursingDocumentosModule,
  ],
})
export class AppModule {}
