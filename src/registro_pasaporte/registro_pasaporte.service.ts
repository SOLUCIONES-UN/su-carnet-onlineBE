import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateRegistroPasaporteDto } from './dto/create-registro_pasaporte.dto';
import { UpdateRegistroPasaporteDto } from './dto/update-registro_pasaporte.dto';
import { RegistroPasaporte } from '../entities/RegistroPasaporte';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CaracteristicasSucursales } from '../entities/CaracteristicasSucursales';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class RegistroPasaporteService {

  private readonly logger = new Logger("RegistroPasaporteService");

  constructor(

    @InjectRepository(RegistroPasaporte)
    private RegistroPasaporteRepository: Repository<RegistroPasaporte>,

    @InjectRepository(CaracteristicasSucursales)
    private CaracteristicasSucursalesRepository: Repository<CaracteristicasSucursales>,
  )
  { }

  async create(createRegistroPasaporteDto: CreateRegistroPasaporteDto) {
    

    try {

      const {idCaracteristicasSucursales, ...infoData} = createRegistroPasaporteDto;

      const caracteristicasSucursales = await this.CaracteristicasSucursalesRepository.findOneBy({ id: idCaracteristicasSucursales });
  
      if (!caracteristicasSucursales) {
        throw new NotFoundException(`caracteristicasSucursales con ID ${idCaracteristicasSucursales} no encontrado`);
      }
  
      const registro_pasaporte = this.RegistroPasaporteRepository.create({
        ...infoData,
        idCaracteristicasSucursales: caracteristicasSucursales
      });
      
      await this.RegistroPasaporteRepository.save(registro_pasaporte);
  
      return registro_pasaporte;
  
    } catch (error) {
      this.handleDBException(error);
    }

  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const registro_pasaporte = await this.RegistroPasaporteRepository.find({
      where: {estado: 1},
      skip: offset,
      take: limit,
      relations: ['idCaracteristicasSucursales'],
    });
    
    return registro_pasaporte;
  }

  async findOne(id: number) {
    return this.RegistroPasaporteRepository.findOneBy({ id });
  }


  async update(id: number, updateRegistroPasaporteDto: UpdateRegistroPasaporteDto) {
    
    try {

      const {idCaracteristicasSucursales, ...infoData} = updateRegistroPasaporteDto;

      const caracteristicasSucursales = await this.CaracteristicasSucursalesRepository.findOneBy({ id: idCaracteristicasSucursales });
  
      if (!caracteristicasSucursales) {
        throw new NotFoundException(`caracteristicasSucursales con ID ${idCaracteristicasSucursales} no encontrado`);
      }
  
      const registro_pasaporte = await this.RegistroPasaporteRepository.findOneBy({ id });

      if (!registro_pasaporte) {
        throw new NotFoundException(`registro_membresia con ID ${id} no encontrado`);
      }
  
      const updated_registro_pasaporte = this.RegistroPasaporteRepository.merge(registro_pasaporte, {
        ...infoData,
        idCaracteristicasSucursales: caracteristicasSucursales
      });
  
      await this.RegistroPasaporteRepository.save(updated_registro_pasaporte);
  
      return updated_registro_pasaporte;
  
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {

    try {

      const registro_pasaporte = await this.findOne(id);

      if (!registro_pasaporte) {
        throw new NotFoundException(`registro_membresia con ID ${id} not encontrado`);
      }

      registro_pasaporte.estado = 0;

      return await this.RegistroPasaporteRepository.save(registro_pasaporte);

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
