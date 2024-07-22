import { Module } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { NotificacionesController } from './notificaciones.controller';
import { FirebaseAdminModule } from '../firebase-admin/firebase-admin.module';

@Module({

   
  imports: [FirebaseAdminModule],
  controllers: [NotificacionesController],
  providers: [NotificacionesService],
})
export class NotificacionesModule {}
