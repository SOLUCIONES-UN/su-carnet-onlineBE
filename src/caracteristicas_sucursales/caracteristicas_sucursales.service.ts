import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateCaracteristicasSucursaleDto } from './dto/create-caracteristicas_sucursale.dto';
import { UpdateCaracteristicasSucursaleDto } from './dto/update-caracteristicas_sucursale.dto';
import { CaracteristicasSucursales } from '../entities/CaracteristicasSucursales';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class CaracteristicasSucursalesService {

  private readonly logger = new Logger("CaracteristicasSucursalesService");

  constructor(
    @InjectRepository(CaracteristicasSucursales)
    private CaracteristicasSucursalesRepository: Repository<CaracteristicasSucursales>,
  )
  { }

  async create(createCaracteristicasSucursaleDto: CreateCaracteristicasSucursaleDto) {
    
    try {
      const TipoSucursales = this.CaracteristicasSucursalesRepository.create(createCaracteristicasSucursaleDto);

      await this.CaracteristicasSucursalesRepository.save(TipoSucursales);

      return TipoSucursales;

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const caracteristicas_sucursales = await this.CaracteristicasSucursalesRepository.find({
      where: {estado: 1},
      skip: offset,
      take: limit,
    });
    
    return caracteristicas_sucursales;
  }

  async findOne(id: number) {
    return this.CaracteristicasSucursalesRepository.findOneBy({ id });
  }


  async update(id: number, updateCaracteristicasSucursaleDto: UpdateCaracteristicasSucursaleDto) {
    
    try {

      const caracteristicas_sucursales = await this.CaracteristicasSucursalesRepository.findOneBy({ id });
      
      if (!caracteristicas_sucursales) {
        throw new NotFoundException(`caracteristicas_sucursales con ID ${id} no encontrado`);
      }
  
      Object.assign(caracteristicas_sucursales, updateCaracteristicasSucursaleDto);
  
      // Guardar los cambios
      await this.CaracteristicasSucursalesRepository.save(caracteristicas_sucursales);
  
      return caracteristicas_sucursales;

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {

    try {

      const caracteristicas_sucursales = await this.CaracteristicasSucursalesRepository.findOneBy({id});

      if (!caracteristicas_sucursales) {
        throw new NotFoundException(`TipoSucursales con ID ${id} no encontrado`);
      }

      caracteristicas_sucursales.estado = 0;
      return await this.CaracteristicasSucursalesRepository.save(caracteristicas_sucursales);

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
