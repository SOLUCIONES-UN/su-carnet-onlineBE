import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateEmpresasDocumentoDto } from './dto/create-empresas_documento.dto';
import { EmpresasDocumentos } from '../entities/EmpresasDocumentos';
import { InjectRepository } from '@nestjs/typeorm';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { Repository } from 'typeorm';
import { TipoDocumentos } from '../entities/TipoDocumentos';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class EmpresasDocumentosService {

  private readonly logger = new Logger("EmpresasInformacionService");

  constructor(
    @InjectRepository(EmpresasInformacion)
    private empresaRepository: Repository<EmpresasInformacion>,

    @InjectRepository(EmpresasDocumentos)
    private empresaDocumentosRepository: Repository<EmpresasDocumentos>,

    @InjectRepository(TipoDocumentos)
    private tiposDocumentosRepository: Repository<TipoDocumentos>,

  ) { }

  async create(createEmpresasDocumentoDto: CreateEmpresasDocumentoDto) {
    
    try {
      
      const { idEmpresa, idTipoDocumento, ...infoData } = createEmpresasDocumentoDto;
  
      const empresaInformacion = await this.empresaRepository.findOneBy({ id: idEmpresa });
  
      if (!empresaInformacion) {
        throw new NotFoundException(`empresaInformacion con ID ${idEmpresa} no encontrada`);
      }

      const TipoDocumentos = await this.tiposDocumentosRepository.findOneBy({id:idTipoDocumento});

      if(!TipoDocumentos){
        throw new NotFoundException(`TipoDocumentos con ID ${idTipoDocumento} no encontrado`);
      }
  
      const empresaDocumentos = this.empresaDocumentosRepository.create({
        ...infoData,
        idEmpresa: empresaInformacion,
        idTipoDocumento: TipoDocumentos
      });
  
      await this.empresaDocumentosRepository.save(empresaDocumentos);
  
      return empresaDocumentos; 

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const empresaDocumentos = await this.empresaDocumentosRepository.find({
      skip: offset,
      take: limit,
      relations: ['idEmpresa', 'idTipoDocumento'],
    });
    
    return empresaDocumentos;
  }

  async remove(id: number) {
    
    try {
      
      const empresaDocumentos = await this.empresaDocumentosRepository.findOne({ where: { id } });

      if(!empresaDocumentos){
        throw new NotFoundException(`empresaDocumentos con ID ${id} not encontrado`);
      }
      return await this.empresaDocumentosRepository.remove(empresaDocumentos);

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
