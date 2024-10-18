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

    @InjectRepository(EmpresasInformacion)
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

    try {
      let whereCondition: any = { estado: 1 };
  
      // Si idEmpresa es 0, traemos todos los registros (sin filtro por empresa ni sucursal)
      if (idEmpresa !== 0) {
        const empresa = await this.EmpresasInformacionRepository.findOneBy({ id: idEmpresa });
        if (!empresa) {
          return new GenericResponse('400', `No se encontró Empresa con el ID ${idEmpresa}`, null);
        }
  
        // Si idSucursal es 0, obtenemos todas las sucursales de la empresa
        if (idSucursal === 0) {
          const sucursalesDeEmpresa = await this.SucursalesInformacionRepository.find({
            where: { idEmpresa: empresa },
          });
  
          const idsSucursales = sucursalesDeEmpresa.map(sucursal => sucursal.id);
  
          // Si hay sucursales asociadas, las añadimos al filtro
          if (idsSucursales.length > 0) {
            whereCondition.idSucursal = In(idsSucursales);
          } else {
            // Si no hay sucursales asociadas, retornamos un array vacío
            return new GenericResponse('200', 'EXITO', []);
          }
        } else {
          // Si idSucursal es distinto de 0, solo filtramos por idSucursal sin tomar en cuenta idEmpresa
          const sucursal = await this.SucursalesInformacionRepository.findOneBy({ id: idSucursal });
          if (!sucursal) {
            return new GenericResponse('400', `No se encontró Sucursal con el ID ${idSucursal}`, null);
          }
          // Filtramos por la sucursal específica
          whereCondition.idSucursal = sucursal;
        }
      }
  
      // Realizamos la consulta en SucursalesDocumentossRepository con las condiciones
      const sucursalesDocumentos = await this.SucursalesDocumentossRepository.find({
        where: whereCondition,
        relations: ['idSucursal', 'idTipoDocumento', 'idSucursal.idEmpresa'],
      });
  
      return new GenericResponse('200', 'EXITO', sucursalesDocumentos);
  
    } catch (error) {
      return new GenericResponse('500', 'Error al consultar', error.message || error);
    }
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
