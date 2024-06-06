import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateSucursalesDocumentoDto } from './dto/create-sucursales_documento.dto';
import { SucursalesInformacion } from '../entities/SucursalesInformacion';
import { SucursalesDocumentos } from '../entities/SucursalesDocumentos';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoDocumentos } from '../entities/TipoDocumentos';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class SucursalesDocumentosService {

  private readonly logger = new Logger("SucursalesDocumentosService");

  constructor(
    @InjectRepository(SucursalesInformacion)
    private SucursalesInformacionRepository: Repository<SucursalesInformacion>,

    @InjectRepository(SucursalesDocumentos)
    private SucursalesDocumentossRepository: Repository<SucursalesDocumentos>,

    @InjectRepository(TipoDocumentos)
    private tiposDocumentosRepository: Repository<TipoDocumentos>,

  ) { }

  async create(createSucursalesDocumentoDto: CreateSucursalesDocumentoDto) {
    
    try {
      
      const { idSucursal, idTipoDocumento, ...infoData } = createSucursalesDocumentoDto;
  
      const SucursalInformacion = await this.SucursalesInformacionRepository.findOneBy({ id: idSucursal });
  
      if (!SucursalInformacion) {
        throw new NotFoundException(`SucursalInformacion con ID ${idSucursal} no encontrada`);
      }

      const TipoDocumentos = await this.tiposDocumentosRepository.findOneBy({id:idTipoDocumento});

      if(!TipoDocumentos){
        throw new NotFoundException(`TipoDocumentos con ID ${idTipoDocumento} no encontrado`);
      }
  
      const sucursalesDocumentos = this.SucursalesDocumentossRepository.create({
        ...infoData,
        idSucursal: SucursalInformacion,
        idTipoDocumento: TipoDocumentos
      });
  
      await this.SucursalesDocumentossRepository.save(sucursalesDocumentos);
  
      return sucursalesDocumentos; 

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const sucursalesDocumentos = await this.SucursalesDocumentossRepository.find({
      skip: offset,
      take: limit,
      relations: ['idSucursal', 'idTipoDocumento'],
    });
    
    return sucursalesDocumentos;
  }

  async remove(id: number) {
    
    try {
      
      const sucursalesDocumentos = await this.SucursalesDocumentossRepository.findOne({ where: { id } });

      if(!sucursalesDocumentos){
        throw new NotFoundException(`empresaDocumentos con ID ${id} not encontrado`);
      }
      return await this.SucursalesDocumentossRepository.remove(sucursalesDocumentos);

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
