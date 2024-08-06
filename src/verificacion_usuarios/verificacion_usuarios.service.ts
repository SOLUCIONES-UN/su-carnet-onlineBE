import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Otps } from '../entities/Otps';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Usuarios } from '../entities/Usuarios';
import { HtmlEmail } from '../common/dtos/HtmlEmail.dto';
import * as sgMail from '@sendgrid/mail'; 
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio/lib';

@Injectable()
export class VerificacionUsuariosService {

  private client: Twilio;

  private readonly logger = new Logger("VerificacionUsuariosService");

  constructor(

    private configService: ConfigService,

    @InjectRepository(Otps)
    private verificacionUsuariosRepository: Repository<Otps>,
    @InjectRepository(Usuarios)
    private usuariosRepository: Repository<Usuarios>,

  ) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.client = new Twilio(accountSid, authToken);
  }


  async sendSms(telefono: string, message: string): Promise<boolean> {
    const from = this.configService.get<string>('TWILIO_PHONE_NUMBER');

    if (!from) {
      throw new Error('Twilio phone number is not set in environment variables');
    }

    if (!telefono || !message) {
      throw new Error('Recipient phone number and message are required');
    }

    try {
      await this.client.messages.create({
        body: message,
        from: from,
        to: telefono,
      });
      console.log('SMS sent successfully');

      return true;
    } catch (error) {
      console.error('Error sending SMS:', error);

      throw new Error('Failed to send SMS');
    }
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
      from: 'jaarbamo@gmail.com',
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

    for (let i = 0; i < 4; i++) {
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
