import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestModule } from './test/test.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { TiposUsuarioModule } from './tipos_usuario/tipos_usuario.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { VerificacionUsuariosModule } from './verificacion_usuarios/verificacion_usuarios.module';

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
  ],
})
export class AppModule {}
