import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateSucursalesAreasGruposFechaDto } from './dto/create-sucursales_areas_grupos_fecha.dto';
import { UpdateSucursalesAreasGruposFechaDto } from './dto/update-sucursales_areas_grupos_fecha.dto';
import { SucursalesAreasGruposFechas } from '../entities/SucursalesAreasGruposFechas';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SucursalesAreasGruposInformacion } from '../entities/SucursalesAreasGruposInformacion';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class SucursalesAreasGruposFechasService {

  private readonly logger = new Logger("SucursalesAreasGruposFechasService");

  constructor(
    @InjectRepository(SucursalesAreasGruposFechas)
    private SucursalesAreasGruposFechasRepository: Repository<SucursalesAreasGruposFechas>,

    @InjectRepository(SucursalesAreasGruposInformacion)
    private SucursalesAreasGruposInformacionRepository: Repository<SucursalesAreasGruposInformacion>,

  ) { }

  async create(createSucursalesAreasGruposFechaDto: CreateSucursalesAreasGruposFechaDto) {
    
    try {

      const { idAreaGrupo, ...infoData } = createSucursalesAreasGruposFechaDto;
  
      const SucursalesAreasGruposInformacion = await this.SucursalesAreasGruposInformacionRepository.findOneBy({ id: idAreaGrupo });
  
      if (!SucursalesAreasGruposInformacion) {
        throw new NotFoundException(`SucursalesAreasGruposInformacion con ID ${idAreaGrupo} no encontrada`);
      }
  
      const Grupos_fechas = this.SucursalesAreasGruposFechasRepository.create({
        ...infoData,
        idAreaGrupo: SucursalesAreasGruposInformacion
      });
  
      await this.SucursalesAreasGruposFechasRepository.save(Grupos_fechas);
  
      return Grupos_fechas; 
  
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const sucursalesAreasGruposHorarios = await this.SucursalesAreasGruposFechasRepository.find({
      skip: offset,
      take: limit,
      relations: ['idAreaGrupo'],
    });
    
    return sucursalesAreasGruposHorarios;
  }

  async update(id: number, updateSucursalesAreasGruposFechaDto: UpdateSucursalesAreasGruposFechaDto) {
    
    try {
      const { idAreaGrupo, ...infoData } = updateSucursalesAreasGruposFechaDto;
  
      const sucursales_areas_grupos_fechas = await this.SucursalesAreasGruposFechasRepository.findOneBy({ id });

      if (!sucursales_areas_grupos_fechas) {
        throw new NotFoundException(`sucursales_areas_grupos_fechas con ID ${id} no encontrada`);
      }
  
      const SucursalesAreasGruposInformacion = await this.SucursalesAreasGruposInformacionRepository.findOneBy({ id: idAreaGrupo });

      if (!SucursalesAreasGruposInformacion) {
        throw new NotFoundException(`SucursalesAreasGruposInformacion con ID ${idAreaGrupo} no encontrada`);
      }
  
      const update_sucursales_areas_grupos_fechas = this.SucursalesAreasGruposFechasRepository.merge(sucursales_areas_grupos_fechas, {
        ...infoData,
        idAreaGrupo: SucursalesAreasGruposInformacion
      });
  
      // Guardar los cambios en la base de datos
      await this.SucursalesAreasGruposFechasRepository.save(update_sucursales_areas_grupos_fechas);
  
      return update_sucursales_areas_grupos_fechas;
  
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {
    
    try {
      
      const sucursales_areas_grupos_fechas = await this.SucursalesAreasGruposFechasRepository.findOne({ where: { id } });

      if(!sucursales_areas_grupos_fechas){
        throw new NotFoundException(`sucursales_areas_grupos_horario con ID ${id} not encontrado`);
      }
      return await this.SucursalesAreasGruposFechasRepository.remove(sucursales_areas_grupos_fechas);

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
