import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateSucursalesDocumentoDto } from './dto/create-sucursales_documento.dto';
import { SucursalesInformacion } from '../entities/SucursalesInformacion';
import { SucursalesDocumentos } from '../entities/SucursalesDocumentos';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { TipoDocumentos } from '../entities/TipoDocumentos';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { GenericResponse } from '../common/dtos/genericResponse.dto';

@Injectable()
export class SucursalesDocumentosService {

  private readonly logger = new Logger("SucursalesDocumentosService");

  constructor(
    @InjectRepository(SucursalesInformacion)
    private SucursalesInformacionRepository: Repository<SucursalesInformacion>,

    @InjectRepository(SucursalesInformacion)
    private EmpresasInformacionRepository: Repository<EmpresasInformacion>,

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

  async findAll(idEmpresa: number, idSucursal: number) {

    if (idEmpresa !== 0) {
      const empresa = await this.EmpresasInformacionRepository.findOneBy({ id: idEmpresa });
      if (!empresa) {
        return new GenericResponse('400', `No se encontró Empresa con el ID ${idEmpresa}`, null);
      }
    }
  
    if (idSucursal !== 0) {
      const sucursal = await this.SucursalesInformacionRepository.findOneBy({ id: idSucursal });
      if (!sucursal) {
        return new GenericResponse('400', `No se encontró Sucursal con el ID ${idSucursal}`, null);
      }
    }
  
    let whereCondition: any = { estado: 1 };
  
    if (idEmpresa !== 0) {
      const empresa = await this.EmpresasInformacionRepository.findOneBy({ id: idEmpresa });
      const sucursalesDeEmpresa = await this.SucursalesInformacionRepository.find({
        where: { idEmpresa: empresa },
        select: ['id'], 
      });
  
      const idsSucursales = sucursalesDeEmpresa.map(sucursal => sucursal.id);
      whereCondition.idSucursal = In(idsSucursales);
    }
  
    if (idSucursal !== 0) {
      whereCondition.idSucursal = idSucursal;
    }
  
    const sucursalesDocumentos = await this.SucursalesDocumentossRepository.find({
      where: whereCondition,
      relations: ['idSucursal', 'idTipoDocumento'],
    });
  
    return new GenericResponse('200', 'Éxito', sucursalesDocumentos);
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
