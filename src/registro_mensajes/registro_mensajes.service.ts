import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateRegistroMensajeDto } from './dto/create-registro_mensaje.dto';
import { RegistroMensajes } from '../entities/RegistroMensajes';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import * as bcrypt from 'bcrypt';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class RegistroMensajesService {

  private readonly logger = new Logger("RegistroMensajesService");

  constructor(
    @InjectRepository(RegistroMensajes)
    private RegistroMensajesRepository: Repository<RegistroMensajes>,

    @InjectRepository(RegistroInformacion)
    private RegistroInformacionRepository: Repository<RegistroInformacion>,

  ) { }

  async create(createRegistroMensajeDto: CreateRegistroMensajeDto) {
    
    try {

      const { idRegistroInformacion, titulo, contenido, ...infoData } = createRegistroMensajeDto;

      const RegistroInformacion = await this.RegistroInformacionRepository.findOneBy({ id: idRegistroInformacion });

      if (!RegistroInformacion) {
        throw new NotFoundException(`RegistroInformacion con ID ${idRegistroInformacion} no encontrada`);
      }

      const saltRounds = 10;

      const [tituloEncript, contenidoEncript] = await Promise.all([
        bcrypt.hash(titulo, saltRounds),
        bcrypt.hash(contenido, saltRounds),
      ]);

      const RegistroMensajes = this.RegistroMensajesRepository.create({
        ...infoData,
        titulo: tituloEncript,
        contenido: contenidoEncript,
        idRegistroInformacion: RegistroInformacion,
        estado: 'ACT'
      });

      await this.RegistroMensajesRepository.save(RegistroMensajes);

      return RegistroMensajes;

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const RegistroMensajes = await this.RegistroMensajesRepository.find({
      skip: offset,
      take: limit,
      relations: ['idRegistroInformacion'],
    });

    return RegistroMensajes;
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(`Error : ${error.message}`);
    throw new InternalServerErrorException('Error ');
  }
  
}
