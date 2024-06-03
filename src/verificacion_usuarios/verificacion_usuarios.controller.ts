import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { VerificacionUsuariosService } from './verificacion_usuarios.service';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { CreateVerificacionUsuarioDto } from './dto/create-verificacion_usuario.dto';
import { confirmarUsuario } from './dto/confirmar-usuario.dto';

@Controller('verificacion-usuarios')
export class VerificacionUsuariosController {
  constructor(private readonly verificacionUsuariosService: VerificacionUsuariosService) {} 

  @Post('generar-otp')
  async generarOtp(@Body() CreateVerificacionUsuarioDto: CreateVerificacionUsuarioDto) {
    
    try {

      const usuarioActivo = await this.verificacionUsuariosService.usuarioActivo(CreateVerificacionUsuarioDto.correoElectronico);

      if( usuarioActivo == false){
        return new GenericResponse('400', 'EL USUARIO NO ESTA ACTIVO O NO EXISTE ', usuarioActivo); 
      }

      const otpGenerado = this.verificacionUsuariosService.generateRandomCode();
      const result = await this.verificacionUsuariosService.GenerarOtp(CreateVerificacionUsuarioDto.correoElectronico, otpGenerado);

      if(result == false){
        return new GenericResponse('400', 'ERROR AL GUARDAR OTP GENERADO', result); 
      }

      if(CreateVerificacionUsuarioDto.formaEnvio == 'texto'){
        return new GenericResponse('400', 'ESE MEDIO DE ENVIO DE OTP AUN NO SE IMPLEMENTA', result); 
      }

      const enviarCorreo = await this.verificacionUsuariosService.enviarPorEmail(CreateVerificacionUsuarioDto.correoElectronico, otpGenerado, CreateVerificacionUsuarioDto.accion);

      if(enviarCorreo == false){
        return new GenericResponse('400', 'ERROR AL ENVIAR CORREO ', result); 
      }
      return new GenericResponse('200', 'EXITO', result); 

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'ERROR INTERNO ', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('confirmar-usuario')
  async confirmarUsuario(@Body() confirmarUsuario: confirmarUsuario) {
    
    try {

      const usuarioActivo = await this.verificacionUsuariosService.usuarioActivo(confirmarUsuario.correoElectronico);

      if( usuarioActivo == false)  return new GenericResponse('400', 'EL USUARIO NO ESTA ACTIVO O NO EXISTE ', usuarioActivo); 

      const existeOtp = await this.verificacionUsuariosService.existsOtp(confirmarUsuario.otp);

      if(existeOtp == false) return new GenericResponse('400', 'EL CODIGO DE VERIFICACION NO ES CORRECTO ', existeOtp); 

      const codigoExpirado = await this.verificacionUsuariosService.codigoExpirado(confirmarUsuario.otp);

      if(codigoExpirado == true){
        await this.verificacionUsuariosService.remove(confirmarUsuario.otp);
        return new GenericResponse('400', 'EL CODIGO DE VERIFICACION A EXPIRADO DEBE GENERAR OTRO ', codigoExpirado); 
      }

      const result = await this.verificacionUsuariosService.confirmarUsuario(confirmarUsuario.correoElectronico, confirmarUsuario.otp);
      return new GenericResponse('200', 'EXITO', result); 

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al confirmar el usuario', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
}
