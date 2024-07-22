import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';


@Injectable()
export class NotificacionesService {
  
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
  ) {}
  
  async sendNotification(token: string, payload: admin.messaging.MessagingPayload) {
    try {
      const response = await this.firebaseAdmin.messaging().sendToDevice(token, payload);
      return response;
    } catch (error) {
      throw new Error(`Error al enviar la notificacion push: ${error.message}`);
    }
  }
}
