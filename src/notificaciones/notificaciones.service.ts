import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreateNotificacioneDto } from './dto/create-notificacione.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { Notificaciones } from '../entities/Notificaciones';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuarios } from '../entities/Usuarios';


@Injectable()
export class NotificacionesService {
  
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,

    @InjectRepository(Notificaciones)
    private NotificacionesRepository: Repository<Notificaciones>,
    
  ) {}

  async sendNotification(createNotificacioneDto: CreateNotificacioneDto) {
    try {
      if (!createNotificacioneDto.tokens || createNotificacioneDto.tokens.length === 0) {
        throw new Error('El array de tokens debe contener al menos un token');
      }

      const messagingPayload: admin.messaging.MulticastMessage = {
        tokens: createNotificacioneDto.tokens,  
        notification: {
          title: createNotificacioneDto.payload.notification.title,
          body: createNotificacioneDto.payload.notification.body,
        },
        data: {
          dispatch: createNotificacioneDto.payload.data.dispatch,
          customDataKey: createNotificacioneDto.payload.data.customDataKey,
        },
      };
  
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

  async saveNotification(notificacionDto: CreateNotificacioneDto, idUsuario: Usuarios){

    try {

      const notificacion = this.NotificacionesRepository.create({
        title: notificacionDto.payload.notification.title,
        fechaGeneracion:  new Date(),
        body: notificacionDto.payload.notification.body,
        idusuario: idUsuario,
        dispatch: notificacionDto.payload.data.dispatch
      });
  
      await this.NotificacionesRepository.save(notificacion);

      return new GenericResponse('200', `EXITO`, []);

    } catch (error) {
      return new GenericResponse('500', `ERROR`, error.message);
    }
  }

}
