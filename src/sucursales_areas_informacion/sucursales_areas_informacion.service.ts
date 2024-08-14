import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateSucursalesAreasInformacionDto } from './dto/create-sucursales_areas_informacion.dto';
import { UpdateSucursalesAreasInformacionDto } from './dto/update-sucursales_areas_informacion.dto';
import { SucursalesInformacion } from '../entities/SucursalesInformacion';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SucursalesAreasInformacion } from '../entities/SucursalesAreasInformacion';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class SucursalesAreasInformacionService {

  private readonly logger = new Logger("SucursalesAreasInformacionService");

  constructor(
    @InjectRepository(SucursalesAreasInformacion)
    private sucursalesAreasRepository: Repository<SucursalesAreasInformacion>,

    @InjectRepository(SucursalesInformacion)
    private sucursalesRepository: Repository<SucursalesInformacion>,

  ) { }


  async create(createSucursalesAreasInformacionDto: CreateSucursalesAreasInformacionDto) {
    
    try {
      
      const { idSucursal, ...infoData } = createSucursalesAreasInformacionDto;
  
      const sucursal = await this.sucursalesRepository.findOneBy({ id: idSucursal });
  
      if (!sucursal) {
        throw new NotFoundException(`sucursal con ID ${idSucursal} no encontrada`);
      }
  
      const areaSucursal = this.sucursalesAreasRepository.create({
        ...infoData,
        idSucursal: sucursal,
      });
  
      await this.sucursalesAreasRepository.save(areaSucursal);
  
      return areaSucursal; 

    } catch (error) {
      this.handleDBException(error);
    }

  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const areaSucursales = await this.sucursalesAreasRepository.find({
      where: { estado: 1 },
      skip: offset,
      take: limit,
      relations: ['idSucursal'],
    });
    
    return areaSucursales;
  }

  async findAllBySucursalId(idSucursal:number) {

    const sucursal = await this.sucursalesRepository.findOneBy({id: idSucursal})

    const SucursalesAreasInformacion = await this.sucursalesAreasRepository.find({
      where: { idSucursal: sucursal, estado: 1, tieneProgramacion: '1' },
      relations: ['idSucursal.idEmpresa'],
    });
    
    return SucursalesAreasInformacion;
  }

  async AreasBySucursalId(idSucursal:number) {

    const sucursal = await this.sucursalesRepository.findOneBy({id: idSucursal})

    const SucursalesAreasInformacion = await this.sucursalesAreasRepository.find({
      where: { idSucursal: sucursal, estado: 1 },
      relations: ['idSucursal.idEmpresa'],
    });
    
    return SucursalesAreasInformacion;
  }

  async findOne(id: number) {
    return this.sucursalesAreasRepository.findOneBy({ id });
  }

  async update(id: number, updateSucursalesAreasInformacionDto: UpdateSucursalesAreasInformacionDto) {
    
    try {
      const { idSucursal, ...infoData } = updateSucursalesAreasInformacionDto;
  
      const areaSucursal = await this.sucursalesAreasRepository.findOneBy({ id });

      if (!areaSucursal) {
        throw new NotFoundException(`areasucursal con ID ${id} no encontrada`);
      }
  
      const sucursal = await this.sucursalesRepository.findOneBy({ id: idSucursal });

      if (!sucursal) {
        throw new NotFoundException(`sucursal con ID ${idSucursal} no encontrada`);
      }
  
      const updateAreaSucursal = this.sucursalesAreasRepository.merge(areaSucursal, {
        ...infoData,
        idSucursal: sucursal
      });
  
      await this.sucursalesAreasRepository.save(updateAreaSucursal);
  
      return updateAreaSucursal;
  
    } catch (error) {
      this.handleDBException(error);
    }

  }

  async remove(id: number) {
    
    try {
      
      const areaSucursal = await this.sucursalesAreasRepository.findOneBy({id});

      if(!areaSucursal){
        throw new NotFoundException(`areaSucursal con ID ${id} not encontrada`);
      }

      areaSucursal.estado = 0;
      return await this.sucursalesAreasRepository.save(areaSucursal);

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
