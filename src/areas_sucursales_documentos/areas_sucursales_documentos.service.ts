import { Injectable } from '@nestjs/common';
import { CreateAreasSucursalesDocumentoDto } from './dto/create-areas_sucursales_documento.dto';
import { UpdateAreasSucursalesDocumentoDto } from './dto/update-areas_sucursales_documento.dto';
import { SucursalesAreasInformacion } from '../entities/SucursalesAreasInformacion';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AreasSucursalesDocumentos } from '../entities/AreasSucursalesDocumentos';
import { TipoDocumentos } from '../entities/TipoDocumentos';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class AreasSucursalesDocumentosService {

  constructor(
    @InjectRepository(SucursalesAreasInformacion)
    private SucursalesAreasInformacionRepository: Repository<SucursalesAreasInformacion>,

    @InjectRepository(AreasSucursalesDocumentos)
    private AreasSucursalesDocumentosRepository: Repository<AreasSucursalesDocumentos>,

    @InjectRepository(TipoDocumentos)
    private tiposDocumentosRepository: Repository<TipoDocumentos>,

  ) { }

  async create(createAreasSucursalesDocumentoDto: CreateAreasSucursalesDocumentoDto) {
    
    try {

      const { idAreaSucursal, idTipoDocumento, ...infoData } = createAreasSucursalesDocumentoDto;
      const areaSucursal = await this.SucursalesAreasInformacionRepository.findOneBy({id: idAreaSucursal});

      if(!areaSucursal) return new GenericResponse('400', `No se encontro el area sucursal con el ID ${idAreaSucursal} `, null);

      const tipoDocumentos = await this.tiposDocumentosRepository.findOneBy({ id: idTipoDocumento });
      if (!tipoDocumentos) return new GenericResponse('400', `No se encontro el tipo documento con el ID ${idTipoDocumento} `, null);

      const existeDocumento = await this.AreasSucursalesDocumentosRepository.findOne({
        where: { idAreasucursal: areaSucursal, idTipoDocumento: tipoDocumentos }
      });
  
      if (!existeDocumento) {
        const areassucursalesDocumentos = this.AreasSucursalesDocumentosRepository.create({
          ...infoData,
          idAreasucursal: areaSucursal,
          idTipoDocumento: tipoDocumentos,
          estado: 1  
        });
  
        await this.AreasSucursalesDocumentosRepository.save(areassucursalesDocumentos);
  
        return new GenericResponse('200', `EXITO`, areassucursalesDocumentos);
  
      } else {
        Object.assign(existeDocumento, infoData); 
        existeDocumento.estado = 1; 
  
        await this.AreasSucursalesDocumentosRepository.save(existeDocumento);
  
        return new GenericResponse('200', `EXITO`, existeDocumento);
      }

    } catch (error) {
      return new GenericResponse('500', `Error al crear `, error);
    }
  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const Documentos = await this.AreasSucursalesDocumentosRepository.find({
      skip: offset,
      take: limit,
      where: {estado: 1},
      relations: ['idAreasucursal', 'idTipoDocumento', 'idAreasucursal.idSucursal', 'idAreasucursal.idSucursal.idEmpresa'],
    });
    
    return new GenericResponse('200', `EXITO`, Documentos);
  }

  findOne(id: number) {
    return `This action returns a #${id} areasSucursalesDocumento`;
  }

  update(id: number, updateAreasSucursalesDocumentoDto: UpdateAreasSucursalesDocumentoDto) {
    return `This action updates a #${id} areasSucursalesDocumento`;
  }

  async remove(id: number) {
    
    try {
      const areassucursales_documento = await this.AreasSucursalesDocumentosRepository.findOneBy({ id });

      if(!areassucursales_documento) return new GenericResponse('400', `No se encontro areaSucursaDocumento con el ID ${id} `, null);

      areassucursales_documento.estado = 0;
      await this.AreasSucursalesDocumentosRepository.save(areassucursales_documento);

      return new GenericResponse('200', `EXITO`, areassucursales_documento);

    } catch (error) {
      return new GenericResponse('500', `Error al eliminar `, error);
    }
  }

}
