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
import { getDay, parseISO } from 'date-fns';

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

    const intervaloCitasMinutos = areaInformacion.minutosProgramacion; // Intervalo de tiempo para citas en minutos
    let horariosCitas = [];

    const gruposFechas = await this.SucursalesAreasGruposFechasRepository.find({
      where: { idAreaGrupo: sucursalGrupoArea, fecha: horarioFechas.fecha }
    });

    const calcularIntervalos = (horaInicio: string, horaFinal: string) => {
      const intervalos = [];
      const [inicioHoras, inicioMinutos] = horaInicio.split(':').map(Number);
      const [finalHoras, finalMinutos] = horaFinal.split(':').map(Number);

      let inicio = new Date();
      inicio.setHours(inicioHoras, inicioMinutos, 0, 0);

      let fin = new Date();
      fin.setHours(finalHoras, finalMinutos, 0, 0);

      while (inicio < fin) {
        const siguienteInicio = new Date(inicio.getTime() + intervaloCitasMinutos * 60000);
        if (siguienteInicio <= fin) {
          intervalos.push({
            horaInicio: inicio.toTimeString().slice(0, 5),
            horaFinal: siguienteInicio.toTimeString().slice(0, 5)
          });
        }
        inicio = siguienteInicio;
      }

      return intervalos;
    };

    const agregarHorarios = async (horarios, fecha) => {
      await Promise.all(horarios.map(async horario => {
        const intervalos = calcularIntervalos(horario.horaInicio, horario.horaFinal);

        for (const intervalo of intervalos) {
          const permisosCount = await this.SucursalesAreasPermisosRepository.count({
            where: {
              idAreaGrupo: horario.idAreaGrupo,
              horaInicio: intervalo.horaInicio,
              horaFinal: intervalo.horaFinal,
              fecha: fecha
            }
          });

          for (let i = 0; i < areaInformacion.cantidadProgramacion; i++) {
            let estado = 1;

            if (permisosCount >= areaInformacion.cantidadProgramacion) {
              estado = 0;
            }

            const date = parseISO(horarioFechas.fecha);
            const diaSemana = getDay(date);

            horariosCitas.push({
              id: horario.id,
              diaSemana: horario.diaSemana || diaSemana,
              fecha: fecha,
              horaInicio: intervalo.horaInicio,
              horaFinal: intervalo.horaFinal,
              estado: estado,
              idAreaGrupo: sucursalGrupoArea
            });
          }
        }
      }));
    };

    if (gruposFechas.length > 0) {
      await agregarHorarios(gruposFechas, horarioFechas.fecha);
    } else {
      const sucursalesAreasGruposHorarios = await this.SucursalesAreasGruposHorariosRepository.find({
        where: { idAreaGrupo: sucursalGrupoArea },
        relations: ['idAreaGrupo'],
      });

      await agregarHorarios(sucursalesAreasGruposHorarios, horarioFechas.fecha);
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
