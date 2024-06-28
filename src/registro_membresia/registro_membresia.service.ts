import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateRegistroMembresiaDto } from './dto/create-registro_membresia.dto';
import { UpdateRegistroMembresiaDto } from './dto/update-registro_membresia.dto';
import { RegistroMembresia } from '../entities/RegistroMembresia';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { CaracteristicasSucursales } from '../entities/CaracteristicasSucursales';

@Injectable()
export class RegistroMembresiaService {

  private readonly logger = new Logger("RegistroMembresiaService");

  constructor(

    @InjectRepository(RegistroMembresia)
    private RegistroMembresiaRepository: Repository<RegistroMembresia>,

    @InjectRepository(CaracteristicasSucursales)
    private CaracteristicasSucursalesRepository: Repository<CaracteristicasSucursales>,
  )
  { }

  async create(createRegistroMembresiaDto: CreateRegistroMembresiaDto) {
    
    try {

      const {idCaracteristicasSucursales, ...infoData} = createRegistroMembresiaDto;

      const caracteristicasSucursales = await this.CaracteristicasSucursalesRepository.findOneBy({ id: idCaracteristicasSucursales });
  
      if (!caracteristicasSucursales) {
        throw new NotFoundException(`caracteristicasSucursales con ID ${idCaracteristicasSucursales} no encontrado`);
      }
  
      const registro_membresia = this.RegistroMembresiaRepository.create({
        ...infoData,
        idCaracteristicasSucursales: caracteristicasSucursales
      });
      
      await this.RegistroMembresiaRepository.save(registro_membresia);
  
      return registro_membresia;
  
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const registro_membresia = await this.RegistroMembresiaRepository.find({
      where: {estado: 1},
      skip: offset,
      take: limit,
      relations: ['idCaracteristicasSucursales'],
    });
    
    return registro_membresia;
  }

  async findOne(id: number) {
    return this.RegistroMembresiaRepository.findOneBy({ id });
  }

  async update(id: number, updateRegistroMembresiaDto: UpdateRegistroMembresiaDto) {
    
    try {

      const {idCaracteristicasSucursales, ...infoData} = updateRegistroMembresiaDto;

      const caracteristicasSucursales = await this.CaracteristicasSucursalesRepository.findOneBy({ id: idCaracteristicasSucursales });
  
      if (!caracteristicasSucursales) {
        throw new NotFoundException(`caracteristicasSucursales con ID ${idCaracteristicasSucursales} no encontrado`);
      }
  
      const registro_membresia = await this.RegistroMembresiaRepository.findOneBy({ id });

      if (!registro_membresia) {
        throw new NotFoundException(`registro_membresia con ID ${id} no encontrado`);
      }
  
      const updated_registro_membresia = this.RegistroMembresiaRepository.merge(registro_membresia, {
        ...infoData,
        idCaracteristicasSucursales: caracteristicasSucursales
      });
  
      await this.RegistroMembresiaRepository.save(updated_registro_membresia);
  
      return updated_registro_membresia;
  
    } catch (error) {
      this.handleDBException(error);
    }

  }

  async remove(id: number) {

    try {

      const registro_membresia = await this.findOne(id);

      if (!registro_membresia) {
        throw new NotFoundException(`registro_membresia con ID ${id} not encontrado`);
      }

      registro_membresia.estado = 0;

      return await this.RegistroMembresiaRepository.save(registro_membresia);

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
