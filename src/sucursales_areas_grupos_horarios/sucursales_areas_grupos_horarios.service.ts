import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateSucursalesAreasGruposHorarioDto } from './dto/create-sucursales_areas_grupos_horario.dto';
import { UpdateSucursalesAreasGruposHorarioDto } from './dto/update-sucursales_areas_grupos_horario.dto';
import { SucursalesAreasGruposHorarios } from '../entities/SucursalesAreasGruposHorarios';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { SucursalesAreasGruposInformacion } from '../entities/SucursalesAreasGruposInformacion';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { SucursalesAreasPermisos } from '../entities/SucursalesAreasPermisos';
import { SucursalesAreasGruposFechas } from '../entities/SucursalesAreasGruposFechas';
import { horarioFechasDto } from './dto/horarioFechasDto';
import { SucursalesInformacion } from '../entities/SucursalesInformacion';
import { SucursalesAreasInformacion } from '../entities/SucursalesAreasInformacion';

@Injectable()
export class SucursalesAreasGruposHorariosService {

  private readonly logger = new Logger("SucursalesAreasGruposHorariosService");

  constructor(
    @InjectRepository(SucursalesAreasGruposHorarios)
    private SucursalesAreasGruposHorariosRepository: Repository<SucursalesAreasGruposHorarios>,

    @InjectRepository(SucursalesAreasGruposFechas)
    private SucursalesAreasGruposFechasRepository: Repository<SucursalesAreasGruposFechas>,

    @InjectRepository(SucursalesAreasGruposInformacion)
    private SucursalesAreasGruposInformacionRepository: Repository<SucursalesAreasGruposInformacion>,

    @InjectRepository(SucursalesAreasPermisos)
    private SucursalesAreasPermisosRepository: Repository<SucursalesAreasPermisos>,

    @InjectRepository(SucursalesInformacion)
    private SucursalesInformacionRepository: Repository<SucursalesInformacion>,

    @InjectRepository(SucursalesAreasInformacion)
    private SucursalesAreasInformacionRepository: Repository<SucursalesAreasInformacion>,

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

  async HorariosCitas(horarioFechas: horarioFechasDto) {

    const sucursalGrupoArea = await this.SucursalesAreasGruposInformacionRepository.findOneBy({ id: horarioFechas.idGrupo });

    if (!sucursalGrupoArea) {
      throw new Error('Grupo no encontrado');
    }

    const areaInformacion = await this.SucursalesAreasInformacionRepository.findOneBy({ id: horarioFechas.idArea });

    if (!areaInformacion) {
      throw new Error('Área información no encontrada');
    }

    let horariosCitas = [];

    const gruposFechas = await this.SucursalesAreasGruposFechasRepository.find({
      where: { idAreaGrupo: sucursalGrupoArea, fecha: horarioFechas.fecha }
    });

    if (gruposFechas.length > 0) {
      await Promise.all(gruposFechas.map(async element => {
        let estado = 1;

        // Contar la cantidad de permisos para esta área y horario
        const permisosCount = await this.SucursalesAreasPermisosRepository.count({
          where: {
            idAreaGrupo: element.idAreaGrupo,
            horaInicio: element.horaInicio,
            horaFinal: element.horaFinal,
            fecha: element.fecha
          }
        });

        if (permisosCount >= areaInformacion.cantidadProgramacion) {
          estado = 0;
        } else {
          estado = 1;
        }

        let dia = 1;

        horariosCitas.push({
          id: element.id,
          diaSemana: dia,
          fecha: element.fecha,
          horaInicio: element.horaInicio,
          horaFinal: element.horaFinal,
          estado: estado,
          idAreaGrupo: sucursalGrupoArea
        });
      }));

    } else {

      const sucursalesAreasGruposHorarios = await this.SucursalesAreasGruposHorariosRepository.find({
        where: { idAreaGrupo: sucursalGrupoArea },
        relations: ['idAreaGrupo'],
      });

      await Promise.all(sucursalesAreasGruposHorarios.map(async horario => {
        let estado = 1;

        // Contar la cantidad de permisos para esta área y horario
        const permisosCount = await this.SucursalesAreasPermisosRepository.count({
          where: {
            idAreaGrupo: horario.idAreaGrupo,
            horaInicio: horario.horaInicio,
            horaFinal: horario.horaFinal
          }
        });

        if (permisosCount >= areaInformacion.cantidadProgramacion) {
          estado = 0;
        } else {
          estado = 1;
        }

        horariosCitas.push({
          id: horario.id,
          diaSemana: horario.diaSemana,
          fecha: horarioFechas.fecha,
          horaInicio: horario.horaInicio,
          horaFinal: horario.horaFinal,
          estado: estado,
          idAreaGrupo: sucursalGrupoArea
        });
      }));
    }

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
