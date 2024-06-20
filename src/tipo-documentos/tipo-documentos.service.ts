import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateTipoDocumentoDto } from './dto/create-tipo-documento.dto';
import { UpdateTipoDocumentoDto } from './dto/update-tipo-documento.dto';
import { TipoDocumentos } from '../entities/TipoDocumentos';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class TipoDocumentosService {

  private readonly logger = new Logger("TipoDocumentosService");

  constructor(
    @InjectRepository(TipoDocumentos)
    private TipoDocumentosRepository: Repository<TipoDocumentos>,
  
  )
  { }

  async create(createTipoDocumentoDto: CreateTipoDocumentoDto) {
    
    try {
      const TipoDocumentos = this.TipoDocumentosRepository.create(createTipoDocumentoDto);

      await this.TipoDocumentosRepository.save(TipoDocumentos);

      return TipoDocumentos;

    } catch (error) {
      this.handleDBException(error);
    }

  }

  async findAll(PaginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = PaginationDto;

    const TipoDocumentos = await this.TipoDocumentosRepository.find({
      where: { estado: 1 },
      skip: offset,
      take: limit,
    });
    
    return TipoDocumentos;
  }

  async findOne(id: number) {
    return this.TipoDocumentosRepository.findOneBy({ id });
  }

  async update(id: number, updateTipoDocumentoDto: UpdateTipoDocumentoDto) {
    
    try {

      const tipoDocumento = await this.TipoDocumentosRepository.findOneBy({ id });
      if (!tipoDocumento) {
        throw new NotFoundException(`tipoDocumento con ID ${id} no encontrado`);
      }
  
      Object.assign(tipoDocumento, updateTipoDocumentoDto);
  
      // Guardar los cambios
      tipoDocumento.estado = 1;
      await this.TipoDocumentosRepository.save(tipoDocumento);
  
      return tipoDocumento;

    } catch (error) {
      this.handleDBException(error);
    }

  }

  async remove(id: number) {

    try {

      const tipoDocumento = await this.TipoDocumentosRepository.findOneBy({id});

      if (!tipoDocumento) {
        throw new NotFoundException(`tipoDocumento con ID ${id} no encontrado`);
      }

      tipoDocumento.estado = 0;
      return await this.TipoDocumentosRepository.save(tipoDocumento);

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
