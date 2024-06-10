import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateTipoRelacionEmpresaDto } from './dto/create-tipo_relacion_empresa.dto';
import { UpdateTipoRelacionEmpresaDto } from './dto/update-tipo_relacion_empresa.dto';
import { TipoRelacionEmpresas } from '../entities/TipoRelacionEmpresas';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class TipoRelacionEmpresasService {

  private readonly logger = new Logger("TipoRelacionEmpresasService");

  constructor(
    @InjectRepository(TipoRelacionEmpresas)
    private TipoRelacionEmpresasRepository: Repository<TipoRelacionEmpresas>

  ) { }

  async create(createTipoRelacionEmpresaDto: CreateTipoRelacionEmpresaDto) {
    
    try {

      const tipoRelacionEmpresa = this.TipoRelacionEmpresasRepository.create(createTipoRelacionEmpresaDto);
      return this.TipoRelacionEmpresasRepository.save(tipoRelacionEmpresa);

    } catch (error) {
      this.handleDBException(error);
    }
  }

 async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const tipos_relacione = await this.TipoRelacionEmpresasRepository.find({
      skip: offset,
      take: limit,
    });
    
    return tipos_relacione;
  }

  async findOne(id: number) {
    return this.TipoRelacionEmpresasRepository.findOneBy({ id });
  }

  async update(id: number, updateTipoRelacionEmpresaDto: UpdateTipoRelacionEmpresaDto) {
    
    try {
      const { ...infoData } = updateTipoRelacionEmpresaDto;
  
      const tipoRelacionEmpresa = await this.TipoRelacionEmpresasRepository.findOneBy({ id });

      if (!tipoRelacionEmpresa) {
        throw new NotFoundException(`tipoRelacionEmpresa con ID ${id} no encontrado`);
      }
  
      const updatedTipoRelacion = this.TipoRelacionEmpresasRepository.merge(tipoRelacionEmpresa, {
        ...infoData,
      });
  
      // Guardar los cambios en la base de datos
      await this.TipoRelacionEmpresasRepository.save(updatedTipoRelacion);
  
      return updatedTipoRelacion;
  
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {

    try {

      const tipo_relacion_empresa = await this.TipoRelacionEmpresasRepository.findOneBy({id});

      if (!tipo_relacion_empresa) {
        throw new NotFoundException(`tipo_relacion_empresa con ID ${id} not encontrado`);
      }

      return await this.TipoRelacionEmpresasRepository.remove(tipo_relacion_empresa);

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
