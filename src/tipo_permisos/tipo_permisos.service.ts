import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateTipoPermisoDto } from './dto/create-tipo_permiso.dto';
import { UpdateTipoPermisoDto } from './dto/update-tipo_permiso.dto';
import { TipoPermisos } from '../entities/TipoPermisos';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class TipoPermisosService {

  private readonly logger = new Logger("TipoPermisosService");

  constructor(
    @InjectRepository(TipoPermisos)
    private TipoPermisosRepository: Repository<TipoPermisos>,
  
  )
  { }

  async create(createTipoPermisoDto: CreateTipoPermisoDto) {
    
    try {
      const tipoPaises = this.TipoPermisosRepository.create(createTipoPermisoDto);

      await this.TipoPermisosRepository.save(tipoPaises);

      return tipoPaises;

    } catch (error) {
      this.handleDBException(error);
    }

  }

  async findAll(PaginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = PaginationDto;

    const tipoPermiso = await this.TipoPermisosRepository.find({
      where: { estado: 1 },
      skip: offset,
      take: limit,
    });
    
    return tipoPermiso;
  }

  async findOne(id: number) {
    return this.TipoPermisosRepository.findOneBy({ id });
  }

  async update(id: number, updateTipoPermisoDto: UpdateTipoPermisoDto) {
    
    try {

      const tipoPermiso = await this.TipoPermisosRepository.findOneBy({ id });
      if (!tipoPermiso) {
        throw new NotFoundException(`tipoPermiso con ID ${id} no encontrado`);
      }
  
      Object.assign(tipoPermiso, updateTipoPermisoDto);
  
      // Guardar los cambios
      await this.TipoPermisosRepository.save(tipoPermiso);
  
      return tipoPermiso;

    } catch (error) {
      this.handleDBException(error);
    }

  }

  async remove(id: number) {

    try {

      const tipoPermiso = await this.TipoPermisosRepository.findOneBy({id});

      if (!tipoPermiso) {
        throw new NotFoundException(`tipoPermiso con ID ${id} no encontrado`);
      }

      tipoPermiso.estado = 0;
      return await this.TipoPermisosRepository.save(tipoPermiso);

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
