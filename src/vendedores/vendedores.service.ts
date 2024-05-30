import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateVendedoreDto } from './dto/create-vendedore.dto';
import { UpdateVendedoreDto } from './dto/update-vendedore.dto';
import { Vendedores } from '../entities/Vendedores';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class VendedoresService {

  private readonly logger = new Logger("VendedoresService");

  constructor(
    @InjectRepository(Vendedores)
    private vendedoresRepository: Repository<Vendedores>,
  
  )
  { }

  async create(createVendedoreDto: CreateVendedoreDto) {
    
    try {
      const vendedor = this.vendedoresRepository.create(createVendedoreDto);

      await this.vendedoresRepository.save(vendedor);

      return vendedor;

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(PaginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = PaginationDto;

    const vendedores = await this.vendedoresRepository.find({
      where: { estado: 1 },
      skip: offset,
      take: limit,
    });
    
    return vendedores;
  }

  async findOne(id: number) {
    return this.vendedoresRepository.findOneBy({ id });
  }

  async update(id: number, updateVendedoreDto: UpdateVendedoreDto) {

    try {
      // Buscar el vendedor por ID
      const vendedor = await this.vendedoresRepository.findOneBy({ id });
      if (!vendedor) {
        throw new NotFoundException(`Vendedor con ID ${id} no encontrado`);
      }
  
      // Actualizar los campos del vendedor con los valores del DTO
      Object.assign(vendedor, updateVendedoreDto);
  
      // Guardar los cambios
      await this.vendedoresRepository.save(vendedor);
  
      return vendedor;

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {

    try {

      const vendedor = await this.findOne(id);

      if (!vendedor) {
        throw new NotFoundException(`vendedor con ID ${id} not encontrado`);
      }

      vendedor.estado = 0;
      return await this.vendedoresRepository.save(vendedor);

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
