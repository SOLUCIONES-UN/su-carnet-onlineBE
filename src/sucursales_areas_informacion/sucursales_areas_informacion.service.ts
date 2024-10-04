import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateSucursalesAreasInformacionDto } from './dto/create-sucursales_areas_informacion.dto';
import { UpdateSucursalesAreasInformacionDto } from './dto/update-sucursales_areas_informacion.dto';
import { SucursalesInformacion } from '../entities/SucursalesInformacion';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SucursalesAreasInformacion } from '../entities/SucursalesAreasInformacion';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { SucursalesAreasPuertas } from '../entities/SucursalesAreasPuertas';

@Injectable()
export class SucursalesAreasInformacionService {

  private readonly logger = new Logger("SucursalesAreasInformacionService");

  constructor(
    @InjectRepository(SucursalesAreasInformacion)
    private sucursalesAreasRepository: Repository<SucursalesAreasInformacion>,

    @InjectRepository(SucursalesInformacion)
    private sucursalesRepository: Repository<SucursalesInformacion>,

    @InjectRepository(SucursalesAreasPuertas)
    private SucursalesAreasPuertasRepository: Repository<SucursalesAreasPuertas>,

  ) { }


  async create(createSucursalesAreasInformacionDto: CreateSucursalesAreasInformacionDto) {
    
    try {
      
      const { idSucursal, ...infoData } = createSucursalesAreasInformacionDto;
  
      const sucursal = await this.sucursalesRepository.findOneBy({ id: idSucursal });
  
      if (!sucursal) return new GenericResponse('404', `sucursal con ID ${idSucursal} no encontrada`, []);
  
      const areaSucursal = this.sucursalesAreasRepository.create({
        ...infoData,
        idSucursal: sucursal,
      });
  
      await this.sucursalesAreasRepository.save(areaSucursal);
  
      return new GenericResponse('200', 'EXITO', areaSucursal);

    } catch (error) {
      return new GenericResponse('500', 'Error', error);
    }

  }

  async findAll() {

    try {
      
      const areaSucursales = await this.sucursalesAreasRepository.find({
        where: { estado: 1 },
        relations: ['idSucursal'],
      });
      
      return new GenericResponse('200', 'EXITO', areaSucursales);

    } catch (error) {
      return new GenericResponse('500', 'Error', error);
    }
  }

  async findAllBySucursalId(idSucursal:number) {

    try {
      
      const sucursal = await this.sucursalesRepository.findOneBy({id: idSucursal})

      if (!sucursal) return new GenericResponse('404', `sucursal con ID ${idSucursal} no encontrada`, []);

      const SucursalesAreasInformacion = await this.sucursalesAreasRepository.find({
        where: { idSucursal: sucursal, estado: 1, tieneProgramacion: '1' },
        relations: ['idSucursal.idEmpresa'],
      });
      
      return new GenericResponse('200', 'EXITO', SucursalesAreasInformacion);
    } catch (error) {
      return new GenericResponse('500', 'Error', error);
    }
  }

  async AreasBySucursalId(idSucursal:number) {

    try {
      const sucursal = await this.sucursalesRepository.findOneBy({ id: idSucursal });
  
      if (!sucursal) return new GenericResponse('404', `sucursal con ID ${idSucursal} no encontrada`, []);
  
      const sucursalesAreasInformacion = await this.sucursalesAreasRepository.find({
        where: { idSucursal: sucursal, estado: 1},
        relations: ['idSucursal.idEmpresa'],
      });
  
      const sucursalesAreasConPuertaAsignada = await Promise.all(
        sucursalesAreasInformacion.map(async (area) => {
          const puerta = await this.SucursalesAreasPuertasRepository.findOne({
            where: { idSucursalArea: area }, 
          });
  
          return {
            ...area,
            puertaAsignada: puerta ? true : false, 
          };
        })
      );
  
      return new GenericResponse('200', 'EXITO', sucursalesAreasConPuertaAsignada);
    } catch (error) {
      return new GenericResponse('500', 'Error', error);
    }
  }

  async findOne(id: number) {
    
    try {
      
      const sucursalAreaInformacion = this.sucursalesAreasRepository.findOneBy({ id });

      return new GenericResponse('200', 'EXITO', sucursalAreaInformacion);
    } catch (error) {
      return new GenericResponse('500', 'Error', error);
    }
  }

  async update(id: number, updateSucursalesAreasInformacionDto: UpdateSucursalesAreasInformacionDto) {
    
    try {
      const { idSucursal, ...infoData } = updateSucursalesAreasInformacionDto;
  
      const areaSucursal = await this.sucursalesAreasRepository.findOneBy({ id:id });

      if (!areaSucursal) return new GenericResponse('404', `areasucursal con ID ${id} no encontrada`, []);
  
      const sucursal = await this.sucursalesRepository.findOneBy({ id: idSucursal });

      if (!sucursal) return new GenericResponse('404', `sucursal con ID ${idSucursal} no encontrada`, []);
  
      const updateAreaSucursal = this.sucursalesAreasRepository.merge(areaSucursal, {
        ...infoData,
        idSucursal: sucursal
      });
  
      await this.sucursalesAreasRepository.save(updateAreaSucursal);
  
      return new GenericResponse('200', 'EXITO', updateAreaSucursal);
  
    } catch (error) {
      return new GenericResponse('500', 'Error', error);
    }

  }

  async remove(id: number) {
    
    try {
      
      const areaSucursal = await this.sucursalesAreasRepository.findOneBy({id});

      if(!areaSucursal)return new GenericResponse('404', `areasucursal con ID ${id} no encontrada`, []);

      areaSucursal.estado = 0;
      await this.sucursalesAreasRepository.save(areaSucursal);

      return new GenericResponse('200', 'EXITO', areaSucursal);

    } catch (error) {
      return new GenericResponse('500', 'Error', error);
    }
  }

 
}
