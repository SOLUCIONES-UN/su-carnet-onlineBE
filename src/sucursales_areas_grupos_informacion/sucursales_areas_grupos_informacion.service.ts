import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateSucursalesAreasGruposInformacionDto } from './dto/create-sucursales_areas_grupos_informacion.dto';
import { UpdateSucursalesAreasGruposInformacionDto } from './dto/update-sucursales_areas_grupos_informacion.dto';
import { SucursalesAreasInformacion } from '../entities/SucursalesAreasInformacion';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SucursalesAreasGruposInformacion } from '../entities/SucursalesAreasGruposInformacion';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class SucursalesAreasGruposInformacionService {

  private readonly logger = new Logger("SucursalesAreasGruposInformacionService");

  constructor(
    @InjectRepository(SucursalesAreasInformacion)
    private sucursalesAreasRepository: Repository<SucursalesAreasInformacion>,

    @InjectRepository(SucursalesAreasGruposInformacion)
    private SucursalesAreasGruposRepository: Repository<SucursalesAreasGruposInformacion>,

  ) { }
  
  async create(createSucursalesAreasGruposInformacionDto: CreateSucursalesAreasGruposInformacionDto) {
    
    try {
      
      const { idSucursalArea, ...infoData } = createSucursalesAreasGruposInformacionDto;
  
      const area_sucursal = await this.sucursalesAreasRepository.findOneBy({ id: idSucursalArea });
  
      if (!area_sucursal) {
        throw new NotFoundException(`area_sucursal con ID ${idSucursalArea} no encontrada`);
      }
  
      const areaGrupoSucursal = this.SucursalesAreasGruposRepository.create({
        ...infoData,
        idSucursalArea: area_sucursal,
      });
  
      await this.SucursalesAreasGruposRepository.save(areaGrupoSucursal);
  
      return areaGrupoSucursal; 

    } catch (error) {
      this.handleDBException(error);
    }

  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const areaaGruposSucursal = await this.SucursalesAreasGruposRepository.find({
      where: { estado: 1 },
      skip: offset,
      take: limit,
      relations: ['idSucursalArea'],
    });
    
    return areaaGruposSucursal;
  }

  async findOne(id: number) {
    return this.SucursalesAreasGruposRepository.findOneBy({ id });
  }

  async update(id: number, updateSucursalesAreasGruposInformacionDto: UpdateSucursalesAreasGruposInformacionDto) {
    
    try {
      const { idSucursalArea, ...infoData } = updateSucursalesAreasGruposInformacionDto;
  
      const areaaGruposSucursal = await this.SucursalesAreasGruposRepository.findOneBy({ id });

      if (!areaaGruposSucursal) {
        throw new NotFoundException(`areaaGruposSucursal con ID ${id} no encontrada`);
      }
  
      const areasucursal = await this.sucursalesAreasRepository.findOneBy({ id: idSucursalArea });

      if (!areasucursal) {
        throw new NotFoundException(`areasucursal con ID ${idSucursalArea} no encontrada`);
      }
  
      const updateAreaGrupoSucursal = this.SucursalesAreasGruposRepository.merge(areaaGruposSucursal, {
        ...infoData,
        idSucursalArea: areasucursal
      });
  
      // Guardar los cambios en la base de datos
      await this.SucursalesAreasGruposRepository.save(updateAreaGrupoSucursal);
  
      return updateAreaGrupoSucursal;
  
    } catch (error) {
      this.handleDBException(error);
    }

  }

  async remove(id: number) {
    
    try {
      
      const areaGruposSucursal = await this.SucursalesAreasGruposRepository.findOneBy({id});

      if(!areaGruposSucursal){
        throw new NotFoundException(`areaGruposSucursal con ID ${id} no encontrada`);
      }

      areaGruposSucursal.estado = 0;
      return await this.SucursalesAreasGruposRepository.save(areaGruposSucursal);

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
