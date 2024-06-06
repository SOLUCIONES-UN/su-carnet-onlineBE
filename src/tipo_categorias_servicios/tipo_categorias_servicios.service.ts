import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateTipoCategoriasServicioDto } from './dto/create-tipo_categorias_servicio.dto';
import { UpdateTipoCategoriasServicioDto } from './dto/update-tipo_categorias_servicio.dto';
import { TipoCategoriasServicios } from '../entities/TipoCategoriasServicios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class TipoCategoriasServiciosService {

  private readonly logger = new Logger("TipoCategoriasServiciosService");

  constructor(
    @InjectRepository(TipoCategoriasServicios)
    private TipoCategoriasServicioRepository: Repository<TipoCategoriasServicios>,
  
  )
  { }

  async create(createTipoCategoriasServicioDto: CreateTipoCategoriasServicioDto) {
    
    try {
      const TipoCategoriasServicio = this.TipoCategoriasServicioRepository.create(createTipoCategoriasServicioDto);

      await this.TipoCategoriasServicioRepository.save(TipoCategoriasServicio);

      return TipoCategoriasServicio;

    } catch (error) {
      this.handleDBException(error);
    }

  }

  async findAll(PaginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = PaginationDto;

    const TipoCategoriasServicio = await this.TipoCategoriasServicioRepository.find({
      where: { estado: 1 },
      skip: offset,
      take: limit,
    });
    
    return TipoCategoriasServicio;
  }

  async findOne(id: number) {
    return this.TipoCategoriasServicioRepository.findOneBy({ id });
  }

  async update(id: number, updateTipoCategoriasServicioDto: UpdateTipoCategoriasServicioDto) {
    
    try {

      const TipoCategoriasServicio = await this.TipoCategoriasServicioRepository.findOneBy({ id });
      if (!TipoCategoriasServicio) {
        throw new NotFoundException(`TipoCategoriasServicio con ID ${id} no encontrado`);
      }
  
      Object.assign(TipoCategoriasServicio, updateTipoCategoriasServicioDto);
  
      // Guardar los cambios
      await this.TipoCategoriasServicioRepository.save(TipoCategoriasServicio);
  
      return TipoCategoriasServicio;

    } catch (error) {
      this.handleDBException(error);
    }

  }

  async remove(id: number) {
    
    try {

      const TipoCategoriasServicio = await this.TipoCategoriasServicioRepository.findOneBy({id});

      if (!TipoCategoriasServicio) {
        throw new NotFoundException(`TipoCategoriasServicio con ID ${id} no encontrado`);
      }

      TipoCategoriasServicio.estado = 0;
      return await this.TipoCategoriasServicioRepository.save(TipoCategoriasServicio);

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
