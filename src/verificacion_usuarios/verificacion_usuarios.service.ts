import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Otps } from '../entities/Otps';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Usuarios } from '../entities/Usuarios';
import { HtmlEmail } from '../common/dtos/HtmlEmail.dto';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class VerificacionUsuariosService {
  [x: string]: any;

  private readonly logger = new Logger("VerificacionUsuariosService");

  constructor(
    @InjectRepository(Otps)
    private verificacionUsuariosRepository: Repository<Otps>,
    @InjectRepository(Usuarios)
    private usuariosRepository: Repository<Usuarios>,
  ) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }


  async GenerarOtp(email: string, codeVerification:string): Promise<boolean> {

    const otp = this.verificacionUsuariosRepository.create({
      codigo: codeVerification,
      correo: email,
      fechacreacion: new Date()
    });
    await this.verificacionUsuariosRepository.save(otp);

    return true;
  }

  
  async sendEmail(correoDestino: string, otp: string, action:string): Promise<boolean> {

    const usuario = await this.usuariosRepository.findOne({ where: { email:correoDestino } });

    if(!usuario){
      throw new NotFoundException(`Error al obtener los datos del usuario`);
    }

    const msg = {
      to: correoDestino,
      from: 'jaarbamo@gmail.com', // Tu dirección de correo verificada en SendGrid
      subject: 'Verificación de usuario',
      text: 'verificar tu usuario',
      html: HtmlEmail.bodyForConfirmationCode(usuario.nombres, usuario.apellidos, otp, action),
    };
  
    try {
      await sgMail.send(msg);
      console.log('Email sent');
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      if (error.response) {
        console.error('Response body:', error.response.body);
      }
      return false;
    }
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

  public generateRandomCode(): string {

    let codeVerification = '';

    for (let i = 0; i < 6; i++) {
      const randomDigit = Math.floor(Math.random() * 9) + 1;
      codeVerification += randomDigit.toString();
    }
    return codeVerification;
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(`Error : ${error.message}`);
    throw new InternalServerErrorException('Error ');
  }

}
