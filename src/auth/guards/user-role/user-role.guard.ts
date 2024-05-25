import { BadRequestException, CanActivate, ExecutionContext, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Usuarios } from '../../../entities/Usuarios';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector,
  ) {

  }


  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {


    const validRoles = this.reflector.get<string[]>('roles', context.getHandler());

    const request = context.switchToHttp().getRequest();
    const user = request.user as Usuarios;

    if( !user )
      throw new InternalServerErrorException('Usuario no encontrado (request)');

    console.log('User: ', user.idTipo.descripcion);

    const userRole = user.idTipo.descripcion;

    if( !validRoles.includes(userRole) )
      throw new BadRequestException('No tienes permisos para acceder a este recurso');

    return true;
  }
}
