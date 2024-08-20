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
  
      const sucursalInformacion = await this.SucursalesInformacionRepository.findOneBy({ id: idSucursal });
      if (!sucursalInformacion) {
        throw new NotFoundException(`SucursalInformacion con ID ${idSucursal} no encontrada`);
      }
  
      const tipoDocumentos = await this.tiposDocumentosRepository.findOneBy({ id: idTipoDocumento });
      if (!tipoDocumentos) {
        throw new NotFoundException(`TipoDocumentos con ID ${idTipoDocumento} no encontrado`);
      }
  
      const existeDocumento = await this.SucursalesDocumentossRepository.findOne({
        where: { idSucursal: sucursalInformacion, idTipoDocumento: tipoDocumentos }
      });
  
      if (!existeDocumento) {
        const sucursalesDocumentos = this.SucursalesDocumentossRepository.create({
          ...infoData,
          idSucursal: sucursalInformacion,
          idTipoDocumento: tipoDocumentos,
          estado: 1  
        });
  
        await this.SucursalesDocumentossRepository.save(sucursalesDocumentos);
  
        return sucursalesDocumentos;
  
      } else {
        Object.assign(existeDocumento, infoData); 
        existeDocumento.estado = 1; 
  
        await this.SucursalesDocumentossRepository.save(existeDocumento);
  
        return existeDocumento;
      }
  
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const sucursalesDocumentos = await this.SucursalesDocumentossRepository.find({
      skip: offset,
      take: limit,
      where: {estado: 1},
      relations: ['idSucursal', 'idTipoDocumento'],
    });
    
    return sucursalesDocumentos;
  }

  async remove(id: number) {
    
    try {
      const sucursales_documento =
        await this.SucursalesDocumentossRepository.findOneBy({ id });

      if (!sucursales_documento) {
        throw new NotFoundException(
          `sucursales_documento con ID ${id} not encontrado`,
        );
      }

      sucursales_documento.estado = 0;
      return await this.SucursalesDocumentossRepository.save(sucursales_documento);
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
