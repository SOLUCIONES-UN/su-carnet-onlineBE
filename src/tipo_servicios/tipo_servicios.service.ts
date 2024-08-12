import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateTipoServicioDto } from './dto/create-tipo_servicio.dto';
import { UpdateTipoServicioDto } from './dto/update-tipo_servicio.dto';
import { TipoServicios } from '../entities/TipoServicios';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoCategoriasServicios } from '../entities/TipoCategoriasServicios';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class TipoServiciosService {

  private readonly logger = new Logger("TipoServiciosService");

  constructor(
    @InjectRepository(TipoServicios)
    private TipoServiciosRepository: Repository<TipoServicios>,

    @InjectRepository(TipoCategoriasServicios)
    private categoriaRepository: Repository<TipoCategoriasServicios>,

    @InjectRepository(EmpresasInformacion)
    private empresaRepository: Repository<EmpresasInformacion>,

  ) { }

  async create(createTipoServicioDto: CreateTipoServicioDto) {
    
    try {
      
      const { idEmpresa, idCategoria, ...infoData } = createTipoServicioDto;
  
      const empresa = await this.empresaRepository.findOneBy({ id: idEmpresa });

      const categoria = await this.categoriaRepository.findOneBy({id: idCategoria});
  
      if (!empresa) {
        throw new NotFoundException(`Empresa con ID ${idEmpresa} no encontrada`);
      }

      if (!categoria) {
        throw new NotFoundException(`categoria con ID ${idCategoria} no encontrada`);
      }
  
      const tipo_servicio = this.TipoServiciosRepository.create({
        ...infoData,
        idEmpresa: empresa,
        idCategoria: categoria
      });
  
      await this.TipoServiciosRepository.save(tipo_servicio);
  
      return tipo_servicio; 

    } catch (error) {
      this.handleDBException(error);
    }

  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const tipo_servicios = await this.TipoServiciosRepository.find({
      where: { estado: 1 },
      skip: offset,
      take: limit,
      relations: ['idEmpresa', 'idCategoria'],
    });
    
    return tipo_servicios;
  }

  async findOne(id: number) {
    return this.TipoServiciosRepository.findOneBy({ id });
  }

  async update(id: number, updateTipoServicioDto: UpdateTipoServicioDto) {
    
    try {
      const { idEmpresa, idCategoria, ...infoData } = updateTipoServicioDto;
  
      const tipo_servicio = await this.TipoServiciosRepository.findOneBy({ id });

      if (!tipo_servicio) {
        throw new NotFoundException(`tipo_servicio con ID ${id} no encontrada`);
      }
  
      const empresa = await this.empresaRepository.findOneBy({ id: idEmpresa });

      const categoria = await this.categoriaRepository.findOneBy({id: idCategoria});

      if (!empresa) {
        throw new NotFoundException(`empresa con ID ${idEmpresa} no encontrada`);
      }

      if (!categoria) {
        throw new NotFoundException(`categoria con ID ${idCategoria} no encontrada`);
      }
  
      const update_tipo_servicio = this.TipoServiciosRepository.merge(tipo_servicio, {
        ...infoData,
        idEmpresa: empresa,
        idCategoria: categoria
      });
  
      // Guardar los cambios en la base de datos
      await this.TipoServiciosRepository.save(update_tipo_servicio);
  
      return update_tipo_servicio;
  
    } catch (error) {
      this.handleDBException(error);
    }

  }

  async remove(id: number) {
    
    try {
      
      const tipo_servicio = await this.findOne(id);

      if(!tipo_servicio){
        throw new NotFoundException(`tipo_servicio con ID ${id} not encontrada`);
      }

      tipo_servicio.estado = 0;
      return await this.TipoServiciosRepository.save(tipo_servicio);

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
