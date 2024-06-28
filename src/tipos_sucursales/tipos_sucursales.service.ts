import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateTiposSucursaleDto } from './dto/create-tipos_sucursale.dto';
import { UpdateTiposSucursaleDto } from './dto/update-tipos_sucursale.dto';
import { TipoSucursales } from '../entities/TipoSucursales';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class TiposSucursalesService {

  private readonly logger = new Logger("TiposSucursalesService");

  constructor(
    @InjectRepository(TipoSucursales)
    private TipoSucursalesRepository: Repository<TipoSucursales>,
  )
  { }
  
  async create(createTiposSucursaleDto: CreateTiposSucursaleDto) {
    
    try {
      const TipoSucursales = this.TipoSucursalesRepository.create(createTiposSucursaleDto);

      await this.TipoSucursalesRepository.save(TipoSucursales);

      return TipoSucursales;

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const TipoDocumentos = await this.TipoSucursalesRepository.find({
      where: {estado: 1},
      skip: offset,
      take: limit,
    });
    
    return TipoDocumentos;
  }

  async findOne(id: number) {
    return this.TipoSucursalesRepository.findOneBy({ id });
  }

  async update(id: number, updateTiposSucursaleDto: UpdateTiposSucursaleDto) {
    
    try {

      const TipoSucursales = await this.TipoSucursalesRepository.findOneBy({ id });
      
      if (!TipoSucursales) {
        throw new NotFoundException(`TipoSucursales con ID ${id} no encontrado`);
      }
  
      Object.assign(TipoSucursales, updateTiposSucursaleDto);
  
      // Guardar los cambios
      await this.TipoSucursalesRepository.save(TipoSucursales);
  
      return TipoSucursales;

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {

    try {

      const TipoSucursales = await this.TipoSucursalesRepository.findOneBy({id});

      if (!TipoSucursales) {
        throw new NotFoundException(`TipoSucursales con ID ${id} no encontrado`);
      }

      TipoSucursales.estado = 0;
      return await this.TipoSucursalesRepository.save(TipoSucursales);

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
