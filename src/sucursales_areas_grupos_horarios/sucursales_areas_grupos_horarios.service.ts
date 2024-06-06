import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateSucursalesAreasGruposHorarioDto } from './dto/create-sucursales_areas_grupos_horario.dto';
import { UpdateSucursalesAreasGruposHorarioDto } from './dto/update-sucursales_areas_grupos_horario.dto';
import { SucursalesAreasGruposHorarios } from '../entities/SucursalesAreasGruposHorarios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SucursalesAreasGruposInformacion } from '../entities/SucursalesAreasGruposInformacion';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class SucursalesAreasGruposHorariosService {

  private readonly logger = new Logger("SucursalesAreasGruposHorariosService");

  constructor(
    @InjectRepository(SucursalesAreasGruposHorarios)
    private SucursalesAreasGruposHorariosRepository: Repository<SucursalesAreasGruposHorarios>,

    @InjectRepository(SucursalesAreasGruposInformacion)
    private SucursalesAreasGruposInformacionRepository: Repository<SucursalesAreasGruposInformacion>,

  ) { }

  async create(createSucursalesAreasGruposHorarioDto: CreateSucursalesAreasGruposHorarioDto) {
    
    try {

      const { idAreaGrupo, ...infoData } = createSucursalesAreasGruposHorarioDto;
  
      const sucursalesAreasGruposHorarios = await this.SucursalesAreasGruposInformacionRepository.findOneBy({ id: idAreaGrupo });
  
      if (!sucursalesAreasGruposHorarios) {
        throw new NotFoundException(`sucursalesAreasGruposHorarios con ID ${idAreaGrupo} no encontrada`);
      }
  
      const GruposHorarios = this.SucursalesAreasGruposHorariosRepository.create({
        ...infoData,
        idAreaGrupo: sucursalesAreasGruposHorarios
      });
  
      await this.SucursalesAreasGruposHorariosRepository.save(GruposHorarios);
  
      return GruposHorarios; 
  
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const sucursalesAreasGruposHorarios = await this.SucursalesAreasGruposHorariosRepository.find({
      skip: offset,
      take: limit,
      relations: ['idAreaGrupo'],
    });
    
    return sucursalesAreasGruposHorarios;
  }

  async update(id: number, updateSucursalesAreasGruposHorarioDto: UpdateSucursalesAreasGruposHorarioDto) {
    
    try {
      const { idAreaGrupo, ...infoData } = updateSucursalesAreasGruposHorarioDto;
  
      const sucursales_areas_grupos_horario = await this.SucursalesAreasGruposHorariosRepository.findOneBy({ id });

      if (!sucursales_areas_grupos_horario) {
        throw new NotFoundException(`sucursales_areas_grupos_horario con ID ${id} no encontrada`);
      }
  
      const SucursalesAreasGruposInformacion = await this.SucursalesAreasGruposInformacionRepository.findOneBy({ id: idAreaGrupo });

      if (!SucursalesAreasGruposInformacion) {
        throw new NotFoundException(`SucursalesAreasGruposInformacion con ID ${idAreaGrupo} no encontrada`);
      }
  
      const update_sucursales_areas_grupos_horario = this.SucursalesAreasGruposHorariosRepository.merge(sucursales_areas_grupos_horario, {
        ...infoData,
        idAreaGrupo: SucursalesAreasGruposInformacion
      });
  
      // Guardar los cambios en la base de datos
      await this.SucursalesAreasGruposHorariosRepository.save(update_sucursales_areas_grupos_horario);
  
      return update_sucursales_areas_grupos_horario;
  
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {
    
    try {
      
      const sucursales_areas_grupos_horario = await this.SucursalesAreasGruposHorariosRepository.findOne({ where: { id } });

      if(!sucursales_areas_grupos_horario){
        throw new NotFoundException(`sucursales_areas_grupos_horario con ID ${id} not encontrado`);
      }
      return await this.SucursalesAreasGruposHorariosRepository.remove(sucursales_areas_grupos_horario);

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
