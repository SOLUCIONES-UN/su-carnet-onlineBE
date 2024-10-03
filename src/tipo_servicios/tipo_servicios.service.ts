import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateTipoServicioDto } from './dto/create-tipo_servicio.dto';
import { UpdateTipoServicioDto } from './dto/update-tipo_servicio.dto';
import { TipoServicios } from '../entities/TipoServicios';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoCategoriasServicios } from '../entities/TipoCategoriasServicios';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';

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
  
      if (!empresa) return new GenericResponse('404', `Empresa con ID ${idEmpresa} no encontrada `, []);

      if (!categoria) return new GenericResponse('404', `categoria con ID ${idCategoria} no encontrada `, []);
  
      const tipo_servicio = this.TipoServiciosRepository.create({
        ...infoData,
        idEmpresa: empresa,
        idCategoria: categoria
      });
  
      await this.TipoServiciosRepository.save(tipo_servicio);
  
      return new GenericResponse('200', `EXITO`, tipo_servicio);

    } catch (error) {
      return new GenericResponse('500', `ERROR`, error.message);
    }

  }

  async findAll() {

    try {
      
      const tipo_servicios = await this.TipoServiciosRepository.find({
        where: { estado: 1 },
        relations: ['idEmpresa', 'idCategoria'],
      });
      
      return new GenericResponse('200', `EXITO`, tipo_servicios);

    } catch (error) {
      return new GenericResponse('500', `ERROR`, error.message);
    }
  }

  async findAllByEmpresa(idEmpresa:number) {

    try {

      const empresa = await this.empresaRepository.findOneBy({id:idEmpresa});

      if(!empresa) return new GenericResponse('404', `Empresa no encontrada`, []);
      
      const tipo_servicios = await this.TipoServiciosRepository.find({
        where: { estado: 1, idEmpresa:empresa },
        relations: ['idEmpresa', 'idCategoria'],
      });
      
      return new GenericResponse('200', `EXITO`, tipo_servicios);

    } catch (error) {
      return new GenericResponse('500', `ERROR`, error.message);
    }
  }

  async findOne(id: number) {
    
    try {
      
      const tipo_servicios = await this.TipoServiciosRepository.findOneBy({ id });
      return new GenericResponse('200', `EXITO`, tipo_servicios);

    } catch (error) {
      return new GenericResponse('500', `ERROR`, error.message);
    }
  }

  async update(id: number, updateTipoServicioDto: UpdateTipoServicioDto) {
    
    try {
      const { idEmpresa, idCategoria, ...infoData } = updateTipoServicioDto;
  
      const tipo_servicio = await this.TipoServiciosRepository.findOneBy({ id });

      if (!tipo_servicio) return new GenericResponse('404', `tipo servicio con ID ${id} no encontrad `, []);
  
      const empresa = await this.empresaRepository.findOneBy({ id: idEmpresa });

      const categoria = await this.categoriaRepository.findOneBy({id: idCategoria});

      if (!empresa) return new GenericResponse('404', `Empresa con ID ${idEmpresa} no encontrada `, []);

      if (!categoria) return new GenericResponse('404', `categoria con ID ${idCategoria} no encontrada `, []);
  
      const update_tipo_servicio = this.TipoServiciosRepository.merge(tipo_servicio, {
        ...infoData,
        idEmpresa: empresa,
        idCategoria: categoria
      });
  
      await this.TipoServiciosRepository.save(update_tipo_servicio);
  
      return new GenericResponse('200', `EXITO`, update_tipo_servicio);
  
    } catch (error) {
      return new GenericResponse('500', `ERROR`, error.message);
    }

  }

  async remove(id: number) {
    
    try {
      
      const tipo_servicio = await this.TipoServiciosRepository.findOneBy({id:id});

      if(!tipo_servicio) return new GenericResponse('404', `tipo servicio con ID ${id} no encontrad `, []);

      tipo_servicio.estado = 0;
      return await this.TipoServiciosRepository.save(tipo_servicio);

    } catch (error) {
      return new GenericResponse('500', `ERROR`, error.message);
    }
  }

  
}
