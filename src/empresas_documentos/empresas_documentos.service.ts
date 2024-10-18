import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmpresasDocumentoDto } from './dto/create-empresas_documento.dto';
import { EmpresasDocumentos } from '../entities/EmpresasDocumentos';
import { InjectRepository } from '@nestjs/typeorm';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { Repository } from 'typeorm';
import { TipoDocumentos } from '../entities/TipoDocumentos';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { RegistroAfiliaciones } from '../entities/RegistroAfiliaciones';

@Injectable()
export class EmpresasDocumentosService {
  private readonly logger = new Logger('EmpresasDocumentosService');

  constructor(
    @InjectRepository(EmpresasInformacion)
    private empresaRepository: Repository<EmpresasInformacion>,

    @InjectRepository(EmpresasDocumentos)
    private empresaDocumentosRepository: Repository<EmpresasDocumentos>,

    @InjectRepository(TipoDocumentos)
    private tiposDocumentosRepository: Repository<TipoDocumentos>,
  ) {}

  async create(createEmpresasDocumentoDto: CreateEmpresasDocumentoDto) {
    try {
      const { idEmpresa, idTipoDocumento, ...infoData } =
        createEmpresasDocumentoDto;

      const empresaInformacion = await this.empresaRepository.findOneBy({
        id: idEmpresa,
      });

      if (!empresaInformacion) {
        return new GenericResponse(
          '400',
          `empresaInformacion con id ${createEmpresasDocumentoDto.idEmpresa} no encontrada `,
          [],
        );
      }

      const TipoDocumentos = await this.tiposDocumentosRepository.findOneBy({
        id: idTipoDocumento,
      });

      if (!TipoDocumentos) {
        return new GenericResponse(
          '400',
          `TipoDocumentos con id ${createEmpresasDocumentoDto.idTipoDocumento} no encontrado `,
          [],
        );
      }

      const empresaDocumentos = this.empresaDocumentosRepository.create({
        ...infoData,
        idEmpresa: empresaInformacion,
        idTipoDocumento: TipoDocumentos,
      });

      await this.empresaDocumentosRepository.save(empresaDocumentos);

      return new GenericResponse('200', `EXITO`, empresaDocumentos);
    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async findAll() {
    try {
      const empresaDocumentos = await this.empresaDocumentosRepository.find({
        relations: ['idEmpresa', 'idTipoDocumento'],
      });

      return new GenericResponse('200', `EXITO`, empresaDocumentos);
    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async findAllByEmpresa(idEmpresa: number) {
    try {
      const empresa = await this.empresaRepository.findOneBy({ id: idEmpresa });

      if (!empresa)
        return new GenericResponse('400', `Empresa no encontrada`, []);

      const empresaDocumentos = await this.empresaDocumentosRepository.find({
        where: { idEmpresa: empresa },
        relations: ['idEmpresa', 'idTipoDocumento'],
      });

      return new GenericResponse('200', `EXITO`, empresaDocumentos);
    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async remove(id: number) {
    try {
      const empresaDocumentos = await this.empresaDocumentosRepository.findOne({
        where: { id },
      });

      if (!empresaDocumentos) {
        return new GenericResponse(
          '400',
          `empresaDocumentos con id ${id} no encontrado `,
          [],
        );
      }
      await this.empresaDocumentosRepository.remove(empresaDocumentos);

      return new GenericResponse('200', `EXITO`, empresaDocumentos);
    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }
}
