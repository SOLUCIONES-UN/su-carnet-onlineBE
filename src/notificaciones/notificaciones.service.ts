import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreateNotificacioneDto } from './dto/create-notificacione.dto';


@Injectable()
export class NotificacionesService {
  
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
  ) {}
  
  async sendNotification(createNotificacioneDto: CreateNotificacioneDto) {
    try {
      const messagingPayload: admin.messaging.MessagingPayload = {
        notification: {
          title: createNotificacioneDto.payload.notification.title,
          body: createNotificacioneDto.payload.notification.body,
        },
        data: {
          customDataKey: createNotificacioneDto.payload.data.customDataKey,
        },
      };
      const response = await this.firebaseAdmin.messaging().sendToDevice(createNotificacioneDto.token, messagingPayload);
      return response;
    } catch (error) {
      throw new Error(`Error al enviar la notificacion push: ${error.message}`);
    }
  }

}
