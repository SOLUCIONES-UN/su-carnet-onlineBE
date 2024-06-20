import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateSucursalesAreasGruposHorarioDto } from './dto/create-sucursales_areas_grupos_horario.dto';
import { UpdateSucursalesAreasGruposHorarioDto } from './dto/update-sucursales_areas_grupos_horario.dto';
import { SucursalesAreasGruposHorarios } from '../entities/SucursalesAreasGruposHorarios';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { SucursalesAreasGruposInformacion } from '../entities/SucursalesAreasGruposInformacion';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { SucursalesInformacion } from '../entities/SucursalesInformacion';
import { SucursalesAreasPermisos } from '../entities/SucursalesAreasPermisos';
import { Console, group } from 'console';

@Injectable()
export class SucursalesAreasGruposHorariosService {

  private readonly logger = new Logger("SucursalesAreasGruposHorariosService");

  constructor(
    @InjectRepository(SucursalesAreasGruposHorarios)
    private SucursalesAreasGruposHorariosRepository: Repository<SucursalesAreasGruposHorarios>,

    @InjectRepository(SucursalesAreasGruposInformacion)
    private SucursalesAreasGruposInformacionRepository: Repository<SucursalesAreasGruposInformacion>,

    @InjectRepository(SucursalesAreasPermisos)
    private SucursalesAreasPermisosRepository: Repository<SucursalesAreasPermisos>,

  ) { }

  async create(createSucursalesAreasGruposHorarioDto: CreateSucursalesAreasGruposHorarioDto) {

    try {

      const { idAreaGrupo, ...infoData } = createSucursalesAreasGruposHorarioDto;

      const SucursalesAreasGruposInformacion = await this.SucursalesAreasGruposInformacionRepository.findOneBy({ id: idAreaGrupo });

      if (!SucursalesAreasGruposInformacion) {
        throw new NotFoundException(`SucursalesAreasGruposInformacion con ID ${idAreaGrupo} no encontrada`);
      }

      const GruposHorarios = this.SucursalesAreasGruposHorariosRepository.create({
        ...infoData,
        idAreaGrupo: SucursalesAreasGruposInformacion
      });

      await this.SucursalesAreasGruposHorariosRepository.save(GruposHorarios);

      return GruposHorarios;

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async getHorariosByGrupo(idGrupo: number) {
    // Paso 1: Obtener la información del grupo
    const sucursalGrupoArea = await this.SucursalesAreasGruposInformacionRepository.findOneBy({ id: idGrupo });

    if (!sucursalGrupoArea) {
        throw new Error('Grupo no encontrado');
    }

    // Paso 2: Obtener los horarios relacionados con ese grupo
    const sucursalesAreasGruposHorarios = await this.SucursalesAreasGruposHorariosRepository.find({
        where: { idAreaGrupo: sucursalGrupoArea },
        relations: ['idAreaGrupo'],
    });

    // Paso 3: Inicializar el array de horariosCitas
    let horariosCitas = [];

    // Paso 4: Usar map y Promise.all para manejar las promesas correctamente
    await Promise.all(sucursalesAreasGruposHorarios.map(async horario => {
        // Inicialmente, establecer el estado a 1
        let estado = 1;

        // Verificar si existe un permiso coincidente
        const sucursalesAreasPermisos = await this.SucursalesAreasPermisosRepository.findOne({
            where: { 
                idAreaGrupo: horario.idAreaGrupo, 
                horaInicio: horario.horaInicio, 
                horaFinal: horario.horaFinal 
            },
            relations: ['idAreaGrupo'],
        });

        // Si hay una coincidencia, cambiar el estado a 0
        if (sucursalesAreasPermisos) {
            estado = 0;
        }

        // Agregar el horario al array de horariosCitas con el estado correspondiente
        horariosCitas.push({
            id: horario.id,
            diaSemana: horario.diaSemana,
            horaInicio: horario.horaInicio,
            horaFinal: horario.horaFinal,
            estado: estado,
            idAreaGrupo: sucursalGrupoArea
        });
    }));

    // Devolver los horarios con el estado adecuado
    return horariosCitas;
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

      if (!sucursales_areas_grupos_horario) {
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
