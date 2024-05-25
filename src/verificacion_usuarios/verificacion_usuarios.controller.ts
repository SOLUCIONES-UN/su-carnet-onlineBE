import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { VerificacionUsuariosService } from './verificacion_usuarios.service';
import { GenericResponse } from '../common/dtos/genericResponse.dto';

@Controller('verificacion-usuarios')
export class VerificacionUsuariosController {
  constructor(private readonly verificacionUsuariosService: VerificacionUsuariosService) {} 

  @Post(':correoElectronico/:formaEnvio')
  async generarOtp(@Param('correoElectronico') correoElectronico: string, formaEnvio:string) {
    
    try {

      const usuarioActivo = await this.verificacionUsuariosService.usuarioActivo(correoElectronico);

      if( usuarioActivo == false){
        return new GenericResponse('400', 'EL USUARIO NO ESTA ACTIVO O NO EXISTE ', usuarioActivo); 
      }

      const result = await this.verificacionUsuariosService.GenerarOtp(correoElectronico, formaEnvio);
      return new GenericResponse('200', 'EXITO', result); 

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al generar el otp', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post(':correoElectronico/:otp')
  async confirmarUsuario(@Param('correoElectronico') correoElectronico: string, @Param('otp') otp: string) {
    
    try {

      const usuarioActivo = await this.verificacionUsuariosService.usuarioActivo(correoElectronico);

      if( usuarioActivo == false)  return new GenericResponse('400', 'EL USUARIO NO ESTA ACTIVO O NO EXISTE ', usuarioActivo); 

      const existeOtp = await this.verificacionUsuariosService.existsOtp(otp);

      if(existeOtp == false) return new GenericResponse('400', 'EL CODIGO DE VERIFICACION NO ES CORRECTO ', existeOtp); 

      const codigoExpirado = await this.verificacionUsuariosService.codigoExpirado(otp);

      if(codigoExpirado == true) return new GenericResponse('400', 'EL CODIGO DE VERIFICACION A EXPIRADO DEBE GENERAR OTRO ', codigoExpirado); 

      const result = await this.verificacionUsuariosService.confirmarUsuario(correoElectronico, otp);
      return new GenericResponse('200', 'EXITO', result); 

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al confirmar el usuario', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
}
