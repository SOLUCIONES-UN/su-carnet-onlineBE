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
  ],
})
export class AppModule {}
