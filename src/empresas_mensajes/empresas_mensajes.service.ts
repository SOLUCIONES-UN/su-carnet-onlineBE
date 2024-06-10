import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateEmpresasMensajeDto } from './dto/create-empresas_mensaje.dto';
import { EmpresasMensajes } from '../entities/EmpresasMensajes';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import * as bcrypt from 'bcrypt';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class EmpresasMensajesService {

  private readonly logger = new Logger("EmpresasMensajesService");

  constructor(

    @InjectRepository(EmpresasMensajes)
    private EmpresasMensajesRepository: Repository<EmpresasMensajes>,

    @InjectRepository(EmpresasInformacion)
    private EmpresasInformacionRepository: Repository<EmpresasInformacion>,

  ) { }

  async create(createEmpresasMensajeDto: CreateEmpresasMensajeDto) {
    
    try {
      const { idEmpresa, titulo, contenido, ...infoData } = createEmpresasMensajeDto;

      const EmpresasInformacion = await this.EmpresasInformacionRepository.findOneBy({ id: idEmpresa });

      if (!EmpresasInformacion) {
        throw new NotFoundException(`EmpresasInformacion con ID ${idEmpresa} no encontrada`);
      }

      const saltRounds = 10;

      const [ tituloEncript, contenidoEncript] = await Promise.all([
        bcrypt.hash(titulo, saltRounds),
        bcrypt.hash(contenido, saltRounds),
      ]);

      const empresas_mensaje = this.EmpresasMensajesRepository.create({
        ...infoData,
        titulo: tituloEncript,
        contenido: contenidoEncript,
        fechaHoraEnvio: new Date,
        estado: 'ENV',
        idEmpresa: EmpresasInformacion
      });

      await this.EmpresasMensajesRepository.save(empresas_mensaje);

      return empresas_mensaje;

    } catch (error) {
      this.handleDBException(error);
    }
  }


  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const empresas_mensajes = await this.EmpresasMensajesRepository.find({
      skip: offset,
      take: limit,
      relations: ['idEmpresa'],
    });

    return empresas_mensajes;
  }


  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(`Error : ${error.message}`);
    throw new InternalServerErrorException('Error ');
  }

}
