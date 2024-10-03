import { Module } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { NotificacionesController } from './notificaciones.controller';
import { FirebaseAdminModule } from '../firebase-admin/firebase-admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notificaciones } from '../entities/Notificaciones';
import { Usuarios } from '../entities/Usuarios';

@Module({

  imports: [FirebaseAdminModule,
    TypeOrmModule.forFeature([Notificaciones, Usuarios]),
  ],
  controllers: [NotificacionesController],
  providers: [NotificacionesService],
})
export class NotificacionesModule {}
