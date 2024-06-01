import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateTipoPaiseDto } from './dto/create-tipo_paise.dto';
import { UpdateTipoPaiseDto } from './dto/update-tipo_paise.dto';
import { TipoPaises } from '../entities/TipoPaises';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class TipoPaisesService {

  private readonly logger = new Logger("TipoPaisesService");

  constructor(
    @InjectRepository(TipoPaises)
    private TipoPaisesRepository: Repository<TipoPaises>,
  
  )
  { }

  async create(createTipoPaiseDto: CreateTipoPaiseDto) {
    
    try {
      const tipoPaises = this.TipoPaisesRepository.create(createTipoPaiseDto);

      await this.TipoPaisesRepository.save(tipoPaises);

      return tipoPaises;

    } catch (error) {
      this.handleDBException(error);
    }

  }

  async findAll(PaginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = PaginationDto;

    const TipoDocumentos = await this.TipoPaisesRepository.find({
      where: { estado: 1 },
      skip: offset,
      take: limit,
    });
    
    return TipoDocumentos;
  }

  async findOne(id: number) {
    return this.TipoPaisesRepository.findOneBy({ id });
  }

  async update(id: number, updateTipoPaiseDto: UpdateTipoPaiseDto) {
    
    try {

      const tipoPaises = await this.TipoPaisesRepository.findOneBy({ id });
      if (!tipoPaises) {
        throw new NotFoundException(`tipoPaises con ID ${id} no encontrado`);
      }
  
      Object.assign(tipoPaises, updateTipoPaiseDto);
  
      // Guardar los cambios
      await this.TipoPaisesRepository.save(tipoPaises);
  
      return tipoPaises;

    } catch (error) {
      this.handleDBException(error);
    }

  }

  async remove(id: number) {

    try {

      const tipoPaises = await this.TipoPaisesRepository.findOneBy({id});

      if (!tipoPaises) {
        throw new NotFoundException(`tipoPaises con ID ${id} no encontrado`);
      }

      tipoPaises.estado = 0;
      return await this.TipoPaisesRepository.save(tipoPaises);

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
