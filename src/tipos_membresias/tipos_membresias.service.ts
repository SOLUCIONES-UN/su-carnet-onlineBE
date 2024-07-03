import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateTiposMembresiaDto } from './dto/create-tipos_membresia.dto';
import { UpdateTiposMembresiaDto } from './dto/update-tipos_membresia.dto';
import { TipoMembresia } from '../entities/TipoMembresia';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class TiposMembresiasService {

  private readonly logger = new Logger("TiposMembresiasService");

  constructor(
    @InjectRepository(TipoMembresia)
    private TipoMembresiaRepository: Repository<TipoMembresia>,
  )
  { }
  
  async create(createTiposMembresiaDto: CreateTiposMembresiaDto) {
    
    try {
      const TipoSucursales = this.TipoMembresiaRepository.create(createTiposMembresiaDto);

      await this.TipoMembresiaRepository.save(TipoSucursales);

      return TipoSucursales;

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const tipos_membresias = await this.TipoMembresiaRepository.find({
      where: {estado: 1},
      skip: offset,
      take: limit,
    });
    
    return tipos_membresias;
  }

  async findOne(id: number) {
    return this.TipoMembresiaRepository.findOneBy({ id });
  }

  async update(id: number, updateTiposMembresiaDto: UpdateTiposMembresiaDto) {
    
    try {

      const TipoMembresia = await this.TipoMembresiaRepository.findOneBy({ id });
      
      if (!TipoMembresia) {
        throw new NotFoundException(`TipoMembresia con ID ${id} no encontrado`);
      }
  
      Object.assign(TipoMembresia, updateTiposMembresiaDto);
  
      // Guardar los cambios
      await this.TipoMembresiaRepository.save(TipoMembresia);
  
      return TipoMembresia;

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {

    try {

      const TipoMembresia = await this.TipoMembresiaRepository.findOneBy({id});

      if (!TipoMembresia) {
        throw new NotFoundException(`TipoMembresia con ID ${id} no encontrado`);
      }

      TipoMembresia.estado = 0;
      return await this.TipoMembresiaRepository.save(TipoMembresia);

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
