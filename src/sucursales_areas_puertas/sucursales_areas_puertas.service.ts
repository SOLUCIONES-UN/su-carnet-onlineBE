import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateSucursalesAreasPuertaDto } from './dto/create-sucursales_areas_puerta.dto';
import { UpdateSucursalesAreasPuertaDto } from './dto/update-sucursales_areas_puerta.dto';
import { SucursalesAreasPuertas } from '../entities/SucursalesAreasPuertas';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SucursalesAreasInformacion } from '../entities/SucursalesAreasInformacion';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';

@Injectable()
export class SucursalesAreasPuertasService {

  private readonly logger = new Logger("SucursalesAreasPuertasService");

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
  
      if (!sucursalArea) {
        throw new NotFoundException(`sucursalArea con ID ${idSucursalArea} no encontrada`);
      }
  
      const areaSucursalPuerta = this.sucursalesAreas_Puertas_Repository.create({
        ...infoData,
        idSucursalArea: sucursalArea,
      });
  
      await this.sucursalesAreas_Puertas_Repository.save(areaSucursalPuerta);
  
      return areaSucursalPuerta; 

    } catch (error) {
      this.handleDBException(error);
    }

  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const areaSucursalesPuertas = await this.sucursalesAreas_Puertas_Repository.find({
      skip: offset,
      take: limit,
      relations: ['idSucursalArea', 'idSucursalArea.idSucursal'],
    });
    
    return areaSucursalesPuertas;
  }

  async findAllByArea(idArea: number) {

    try {

      const areaSucursal = await this.sucursalesAreasRepository.findOneBy({id:idArea});

      const areaSucursalesPuertas = await this.sucursalesAreas_Puertas_Repository.find({
        where: {idSucursalArea:areaSucursal},
        relations: ['idSucursalArea', 'idSucursalArea.idSucursal'],
      });
      return new GenericResponse('200', `EXITO`, areaSucursalesPuertas);

    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async findOne(id: number) {
    return this.sucursalesAreasRepository.findOneBy({ id });
  }

  async update(id: number, updateSucursalesAreasPuertaDto: UpdateSucursalesAreasPuertaDto) {
    
    try {
      const { idSucursalArea, ...infoData } = updateSucursalesAreasPuertaDto;
  
      const areaSucursalPuerta = await this.sucursalesAreas_Puertas_Repository.findOneBy({ id });

      if (!areaSucursalPuerta) {
        throw new NotFoundException(`areaSucursalPuerta con ID ${id} no encontrada`);
      }
  
      const sucursalArea = await this.sucursalesAreasRepository.findOneBy({ id: idSucursalArea });

      if (!sucursalArea) {
        throw new NotFoundException(`sucursalArea con ID ${idSucursalArea} no encontrada`);
      }
  
      const updateAreaSucursalPuerta = this.sucursalesAreas_Puertas_Repository.merge(areaSucursalPuerta, {
        ...infoData,
        idSucursalArea: sucursalArea
      });
  
      // Guardar los cambios en la base de datos
      await this.sucursalesAreas_Puertas_Repository.save(updateAreaSucursalPuerta);
  
      return updateAreaSucursalPuerta;
  
    } catch (error) {
      this.handleDBException(error);
    }

  }

  async remove(id: number) {
    
    try {
      
      const areaSucursalPuerta = await this.sucursalesAreas_Puertas_Repository.findOneBy({ id });

      if(!areaSucursalPuerta){
        throw new NotFoundException(`areaSucursalPuerta con ID ${id} no encontrada`);
      }

      return await this.sucursalesAreas_Puertas_Repository.remove(areaSucursalPuerta);

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
