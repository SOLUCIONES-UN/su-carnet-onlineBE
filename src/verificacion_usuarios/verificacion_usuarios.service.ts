import { Injectable, Logger } from '@nestjs/common';
import { CreateVerificacionUsuarioDto } from './dto/create-verificacion_usuario.dto';
import { UpdateVerificacionUsuarioDto } from './dto/update-verificacion_usuario.dto';
import { Otps } from '../entities/Otps';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Usuarios } from '../entities/Usuarios';
import { UsuariosService } from '../usuarios/usuarios.service';
import { use } from 'passport';

@Injectable()
export class VerificacionUsuariosService {

  private readonly logger = new Logger("VerificacionUsuariosService");

  constructor(

    @InjectRepository(Otps)
    private verificacionUsuariosRepository: Repository<Otps>,
    @InjectRepository(Usuarios)
    private usuariosRepository: Repository<Usuarios>,

  ) { }

  async GenerarOtp(correo: string, formaEnvio:string): Promise<boolean> {

    let codeVerification = this.generateRandomCode();

    if(formaEnvio == 'texto'){
      return false; //retornar false porque aun no se ha impplementado esa forma de envio quedara pendiente 
    }

    const otp = this.verificacionUsuariosRepository.create({
      codigo: codeVerification,
      correo: correo,
      fechacreacion: new Date()
    });

    await this.verificacionUsuariosRepository.save(otp);

    return true;
  }

  private async enviarPorEmail(): Promise<boolean> {
    // Implementa la lógica de envío por email aquí
    return true; // Retorna true si el envío fue exitoso
  }


  async confirmarUsuario(email: string, otp: string): Promise<boolean> {

    const user = await this.usuariosRepository.findOne({ where: { email } });

    if (!user) return false;

    user.estado = 2;

    await this.usuariosRepository.save(user);

    if (await this.remove(otp) == false) return false;

    return true;
  }

  async usuarioActivo(email: string): Promise<boolean> {

    const usuario = await this.usuariosRepository.findOne({
      where: {
        email: email,
        estado: Not(0)
      }
    });

    if (!usuario) return false;

    return true;
  }

  async remove(codigo: string): Promise<boolean> {

    try {
      const otp = await this.verificacionUsuariosRepository.findOne({ where: { codigo } });

      if (!otp) return false;

      await this.verificacionUsuariosRepository.remove(otp);

      return true;

    } catch (error) {
      return false;
    }

  }


  async existsOtp(codigo: string): Promise<boolean> {

    if (!await this.verificacionUsuariosRepository.findOne({ where: { codigo } })) return false;

    return true;
  }

  async codigoExpirado(codeOtp: string): Promise<boolean> {

    const otp = await this.verificacionUsuariosRepository.findOne({ where: { codigo: codeOtp } });

    if (!otp) {
      throw new Error('OTP no encontrado');
    }

    const now = new Date();
    const minutesApart = (now.getTime() - otp.fechacreacion.getTime()) / 60000; // Milisegundos a minutos

    if (minutesApart <= 15) {
      return false;
    }

    return true;
  }

  private generateRandomCode(): string {

    let codeVerification = '';

    for (let i = 0; i < 6; i++) {
      const randomDigit = Math.floor(Math.random() * 9) + 1;
      codeVerification += randomDigit.toString();
    }
    return codeVerification;
  }


}
