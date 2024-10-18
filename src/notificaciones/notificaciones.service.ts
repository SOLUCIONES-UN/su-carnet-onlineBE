import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreateNotificacioneDto } from './dto/create-notificacione.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { Notificaciones } from '../entities/Notificaciones';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuarios } from '../entities/Usuarios';
import { updateStateDto } from './dto/updateState.dto';
import { constructNow } from 'date-fns';


@Injectable()
export class NotificacionesService {
  
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,

    @InjectRepository(Notificaciones)
    private NotificacionesRepository: Repository<Notificaciones>,

    @InjectRepository(Usuarios)
    private UsuariosRepository: Repository<Usuarios>,
    
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

  async saveNotification(notificacionDto: CreateNotificacioneDto, idUsuario: number){

    try { 

      const usuario = await this.UsuariosRepository.findOneBy({id:idUsuario});

      const notificacion = this.NotificacionesRepository.create({
        title: notificacionDto.payload.notification.title,
        fechaGeneracion:  new Date(),
        body: notificacionDto.payload.notification.body,
        idusuario: usuario,
        dispatch: notificacionDto.payload.data.dispatch
      });
  
      await this.NotificacionesRepository.save(notificacion);

      return new GenericResponse('200', `EXITO`, []);

    } catch (error) {
      return new GenericResponse('500', `ERROR`, error.message);
    }
  }


  async updateNotification(notificacionDto: CreateNotificacioneDto, idUsuario: number){

    try { 

      const usuario = await this.UsuariosRepository.findOneBy({id:idUsuario});

      const notificacion = await this.NotificacionesRepository.findOneBy({idusuario: usuario});
      
      const notificacionUpdate = this.NotificacionesRepository.merge(notificacion, {
        title: notificacionDto.payload.notification.title,
        fechaGeneracion:  new Date(),
        body: notificacionDto.payload.notification.body,
        idusuario: usuario,
        dispatch: notificacionDto.payload.data.dispatch
      });
  
      await this.NotificacionesRepository.save(notificacionUpdate);

      return new GenericResponse('200', `EXITO`, []);

    } catch (error) {
      return new GenericResponse('500', `ERROR`, error.message);
    }
  }

  
  async GetByUsuario(idUsuario:number){

    try {
      
      const usuario = await this.UsuariosRepository.findOneBy({id:idUsuario});

      if(!usuario) return new GenericResponse('404', `usuario no encontrado`, []);

      const notificaciones = await this.NotificacionesRepository.find({
        where: {idusuario: usuario},
        relations: ['idusuario']
      })

      return new GenericResponse('200', `EXITO`, notificaciones);

    } catch (error) {
      return new GenericResponse('500', `ERROR`, error.message);
    }
  }

  async updateState(updateState: updateStateDto){

    try {
      
      updateState.idsNotificaciones.forEach(async element => {
        
        const notificacion = await this.NotificacionesRepository.findOneBy({id:element});

        if(!notificacion) return new GenericResponse('404', `Notifiacion con id ${element} no encontrado `, []);

        notificacion.estado = updateState.estado;
        await this.NotificacionesRepository.save(notificacion);
      });

      return new GenericResponse('200', `EXITO`, []);

    } catch (error) {
      return new GenericResponse('500', `ERROR`, error.message);
    }
  }

}
