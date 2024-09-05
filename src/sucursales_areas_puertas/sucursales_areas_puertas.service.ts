import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateSucursalesAreasPuertaDto } from './dto/create-sucursales_areas_puerta.dto';
import { UpdateSucursalesAreasPuertaDto } from './dto/update-sucursales_areas_puerta.dto';
import { SucursalesAreasPuertas } from '../entities/SucursalesAreasPuertas';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { SucursalesAreasInformacion } from '../entities/SucursalesAreasInformacion';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';

@Injectable()
export class SucursalesAreasPuertasService {

  constructor(
    @InjectRepository(SucursalesAreasPuertas)
    private sucursalesAreas_Puertas_Repository: Repository<SucursalesAreasPuertas>,

    @InjectRepository(SucursalesAreasInformacion)
    private sucursalesAreasRepository: Repository<SucursalesAreasInformacion>,

  ) { }

  async create(createSucursalesAreasPuertaDto: CreateSucursalesAreasPuertaDto) {
    
    try {
      
      const { idSucursalArea, ...infoData } = createSucursalesAreasPuertaDto;
  
      const sucursalArea = await this.sucursalesAreasRepository.findOneBy({ id: idSucursalArea });
  
      if (!sucursalArea) return new GenericResponse('400', `No se encontro sucursalArea con id $${idSucursalArea}`, null);

      const existeAreaSucursalPuerta = await this.sucursalesAreas_Puertas_Repository.findOneBy({idSucursalArea:sucursalArea});

      if(existeAreaSucursalPuerta) return new GenericResponse('401', `Ya existe esta asignacion `, []); 
  
      const areaSucursalPuerta = this.sucursalesAreas_Puertas_Repository.create({
        ...infoData,
        idSucursalArea: sucursalArea,
      });
  
      await this.sucursalesAreas_Puertas_Repository.save(areaSucursalPuerta);
  
      return new GenericResponse('401', `EXITO`, areaSucursalPuerta); 

    } catch (error) {
      return new GenericResponse('500', `Error`, error); 
    }

  }

  async findAll() {

    try {
      const areaSucursalesPuertas = await this.sucursalesAreas_Puertas_Repository.find({
        relations: ['idSucursalArea', 'idSucursalArea.idSucursal', 'idSucursalArea.idSucursal.idEmpresa'],
      });
      
      return new GenericResponse('200', `EXITO`, areaSucursalesPuertas);
    } catch (error) {
      return new GenericResponse('500', `Error`, error); 
    }
  }

  async findAllByArea(idArea: number) {

    try {

      const areaSucursal = await this.sucursalesAreasRepository.findOneBy({id:idArea});

      const areaSucursalesPuertas = await this.sucursalesAreas_Puertas_Repository.find({
        where: {idSucursalArea:areaSucursal},
        relations: ['idSucursalArea', 'idSucursalArea.idSucursal','idSucursalArea.idSucursal.idEmpresa'],
      });
      return new GenericResponse('200', `EXITO`, areaSucursalesPuertas);

    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async findAllByEmpresa(idEmpresa: number) {
    try {
      const areasSucursales = await this.sucursalesAreasRepository.find({
        where: {
          idSucursal: {
            idEmpresa: {
              id: idEmpresa,
            },
          },
        },
        relations: ['idSucursal', 'idSucursal.idEmpresa'],
      });
  
      if (areasSucursales.length === 0) {
        return new GenericResponse('404', `No se encontraron áreas para la empresa con ID ${idEmpresa}`, []);
      }
  
      // 2. Obtener las puertas de las áreas filtradas en el paso anterior
      const areaSucursalesPuertas = await this.sucursalesAreas_Puertas_Repository.find({
        where: {
          idSucursalArea: {
            id: In(areasSucursales.map(area => area.id)),
          },
        },
        relations: ['idSucursalArea', 'idSucursalArea.idSucursal'],
      });
  
      return new GenericResponse('200', `EXITO`, areaSucursalesPuertas);
  
    } catch (error) {
      return new GenericResponse('500', `Error`, error.message);
    }
  }

  async findOne(id: number) {
    return this.sucursalesAreasRepository.findOneBy({ id });
  }

  async update(id: number, updateSucursalesAreasPuertaDto: UpdateSucursalesAreasPuertaDto) {
    
    try {
      const { idSucursalArea, ...infoData } = updateSucursalesAreasPuertaDto;
  
      const areaSucursalPuerta = await this.sucursalesAreas_Puertas_Repository.findOneBy({ id });

      if (!areaSucursalPuerta) return new GenericResponse('400', `No se encontro areaSucursalPuerta con id $${id}`, null); 
  
      const sucursalArea = await this.sucursalesAreasRepository.findOneBy({ id: idSucursalArea });

      if (!sucursalArea) return new GenericResponse('400', `No se encontro sucursalArea con id $${idSucursalArea}`, null); 
  
      const updateAreaSucursalPuerta = this.sucursalesAreas_Puertas_Repository.merge(areaSucursalPuerta, {
        ...infoData,
        idSucursalArea: sucursalArea
      });
  
      // Guardar los cambios en la base de datos
      await this.sucursalesAreas_Puertas_Repository.save(updateAreaSucursalPuerta);
  
      return new GenericResponse('200', `EXITO`, updateAreaSucursalPuerta);
  
    } catch (error) {
      return new GenericResponse('500', `Error`, error.message);
    }

  }

  async remove(id: number) {
    
    try {
      
      const areaSucursalPuerta = await this.sucursalesAreas_Puertas_Repository.findOneBy({ id });

      if(!areaSucursalPuerta) return new GenericResponse('400', `No se encontro areaSucursalPuerta con id $${id}`, null); 

      await this.sucursalesAreas_Puertas_Repository.remove(areaSucursalPuerta);

      return new GenericResponse('200', `EXITO`, areaSucursalPuerta);

    } catch (error) {
      return new GenericResponse('500', `Error`, error.message);
    }
  }
  
}
