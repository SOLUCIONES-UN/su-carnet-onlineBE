import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreateNotificacioneDto } from './dto/create-notificacione.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';


@Injectable()
export class NotificacionesService {
  
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
  ) {}
  
  // async sendNotification(createNotificacioneDto: CreateNotificacioneDto) {
    
  //   try {
  //     const messagingPayload: admin.messaging.Message = {
  //       token: createNotificacioneDto.token,
  //       notification: {
  //         title: createNotificacioneDto.payload.notification.title,
  //         body: createNotificacioneDto.payload.notification.body,
  //       },
  //       data: {
  //         customDataKey: createNotificacioneDto.payload.data.customDataKey,
  //       },
  //     };
  
  //     const response = await this.firebaseAdmin.messaging().send(messagingPayload);
  
  //     return new GenericResponse('200', `EXITO`, response);
  //   } catch (error) {
  //     return new GenericResponse('500', `ERROR`, error.message);
  //   }
  // }

  async sendNotification(createNotificacioneDto: CreateNotificacioneDto) {
    try {
      // Prepara el payload de la notificación
      const messagingPayload: admin.messaging.MulticastMessage = {
        tokens: createNotificacioneDto.tokens,  
        notification: {
          title: createNotificacioneDto.payload.notification.title,
          body: createNotificacioneDto.payload.notification.body,
        },
        data: {
          customDataKey: createNotificacioneDto.payload.data.customDataKey,
        },
      };
  
      // Envía la notificación usando sendEachForMulticast
      const response = await this.firebaseAdmin.messaging().sendEachForMulticast(messagingPayload);
  
      // Verifica cuántos envíos fueron exitosos y cuántos fallaron
      if (response.failureCount > 0) {
        const failedTokens: string[] = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(createNotificacioneDto.tokens[idx]);
          }
        });
        console.log('Error en los siguientes tokens:', failedTokens);
      }
  
      return new GenericResponse('200', `EXITO`, response);
    } catch (error) {
      return new GenericResponse('500', `ERROR`, error.message);
    }
  }

}
