import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreateNotificacioneDto } from './dto/create-notificacione.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';


@Injectable()
export class NotificacionesService {
  
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
  ) {}
  
  async sendNotification(createNotificacioneDto: CreateNotificacioneDto) {
    
    try {
      const messagingPayload: admin.messaging.Message = {
        token: createNotificacioneDto.token,
        notification: {
          title: createNotificacioneDto.payload.notification.title,
          body: createNotificacioneDto.payload.notification.body,
        },
        data: {
          customDataKey: createNotificacioneDto.payload.data.customDataKey,
        },
      };
  
      const response = await this.firebaseAdmin.messaging().send(messagingPayload);
  
      return new GenericResponse('200', `EXITO`, response);
    } catch (error) {
      return new GenericResponse('500', `ERROR`, error.message);
    }
  }

}
