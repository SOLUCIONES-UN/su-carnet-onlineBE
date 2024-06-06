import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateRegistroDocumentoDto } from './dto/create-registro_documento.dto';
import { UpdateRegistroDocumentoDto } from './dto/update-registro_documento.dto';
import { RegistroDocumentos } from '../entities/RegistroDocumentos';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { TipoDocumentos } from '../entities/TipoDocumentos';
import * as bcrypt from 'bcrypt';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class RegistroDocumentosService {

  private readonly logger = new Logger("RegistroDocumentosService");

  constructor(
    @InjectRepository(RegistroDocumentos)
    private RegistroDocumentosRepository: Repository<RegistroDocumentos>,

    @InjectRepository(RegistroInformacion)
    private RegistroInformacionRepository: Repository<RegistroInformacion>,

    @InjectRepository(TipoDocumentos)
    private TipoDocumentosRepository: Repository<TipoDocumentos>

  ) { }

  // Función para transformar la fecha
  transformDate(dateString: string): string {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  }

  async create(createRegistroDocumentoDto: CreateRegistroDocumentoDto) {
    
    try {
      const { idRegistroInformacion, idTipoDocumento, numero, archivo, ...infoData } = createRegistroDocumentoDto;

      const registro_informacion = await this.RegistroInformacionRepository.findOneBy({ id: idRegistroInformacion });

      const TipoDocumentos = await this.TipoDocumentosRepository.findOneBy({ id: idTipoDocumento });

      if (!registro_informacion) {
        throw new NotFoundException(`registro_informacion con ID ${idRegistroInformacion} no encontrada`);
      }

      if (!TipoDocumentos) {
        throw new NotFoundException(`TipoDocumentos con ID ${idRegistroInformacion} no encontrada`);
      }

      const saltRounds = 10;

      const [numeroEncript, archivoEncript] = await Promise.all([
        bcrypt.hash(numero, saltRounds),
        bcrypt.hash(numero, saltRounds),
      ]);

      const fechaVencimientoTransformada = this.transformDate(createRegistroDocumentoDto.fechaVencimiento);

      const RegistroDocumento = this.RegistroDocumentosRepository.create({
        ...infoData,
        numero: numeroEncript,
        archivo: archivoEncript,
        idRegistroInformacion: registro_informacion,
        idTipoDocumento: TipoDocumentos,
        fechaVencimiento: fechaVencimientoTransformada, 
        estado: 'PEN'
      });

      await this.RegistroDocumentosRepository.save(RegistroDocumento);

      return RegistroDocumento;

    } catch (error) {
      this.handleDBException(error);
    }

  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const RegistroDocumento = await this.RegistroDocumentosRepository.find({
      skip: offset,
      take: limit,
      relations: ['idRegistroInformacion',"idTipoDocumento"],
    });

    return RegistroDocumento;
  }


  async acepatarDocumento(id: number) {
   
    try {

      const RegistroDocumento = await this.RegistroDocumentosRepository.findOneBy({ id });

      if (!RegistroDocumento) {
        throw new NotFoundException(`RegistroDocumento con ID ${id} not encontrado`);
      }

      RegistroDocumento.estado = 'ACEP';
      return await this.RegistroDocumentosRepository.save(RegistroDocumento);

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {
    
    try {

      const RegistroDocumento = await this.RegistroDocumentosRepository.findOneBy({ id });

      if (!RegistroDocumento) {
        throw new NotFoundException(`RegistroDocumento con ID ${id} not encontrado`);
      }

      RegistroDocumento.estado = 'INA';
      return await this.RegistroDocumentosRepository.save(RegistroDocumento);

    } catch (error) {
      this.handleDBException(error);
    }
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(`Error : ${error.message}`);
    throw new InternalServerErrorException('Error ');
  }
}
