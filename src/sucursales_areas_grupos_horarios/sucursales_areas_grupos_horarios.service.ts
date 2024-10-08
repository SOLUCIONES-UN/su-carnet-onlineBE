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
import { GenericResponse } from '../common/dtos/genericResponse.dto';

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

      if (!SucursalesAreasGruposInformacion) return new GenericResponse('400',`SucursalesAreasGruposInformacion con ID ${idAreaGrupo} no encontrada`, []);

      
      const existeHorarioGrupo = await this.SucursalesAreasGruposHorariosRepository.findOne({
        where: {idAreaGrupo: SucursalesAreasGruposInformacion, diaSemana: createSucursalesAreasGruposHorarioDto.diaSemana}
      });

      if(existeHorarioGrupo) return new GenericResponse('401', `Ya existe un horario apra este grupo`, SucursalesAreasGruposInformacion);

      const GruposHorarios = this.SucursalesAreasGruposHorariosRepository.create({
        ...infoData,
        idAreaGrupo: SucursalesAreasGruposInformacion
      });

      await this.SucursalesAreasGruposHorariosRepository.save(GruposHorarios);

      return new GenericResponse('200', `EXITO`, GruposHorarios);

    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }


  getDayOfWeek(dateString: string): number {
    const date = parseISO(dateString);
    const dayOfWeek = getDay(date); // Sunday: 0, Monday: 1, ..., Saturday: 6
    return dayOfWeek;
  }

  async HorariosCitas(horarioFechas: horarioFechasDto) {

    try {
      const diaSemana = this.getDayOfWeek(horarioFechas.fecha);

      const sucursalGrupoArea = await this.SucursalesAreasGruposInformacionRepository.findOneBy({ id: horarioFechas.idGrupo });

      if (!sucursalGrupoArea) return new GenericResponse('400',`sucursalGrupoArea con ID ${horarioFechas.idGrupo} no encontrado`, []);

      const areaInformacion = await this.SucursalesAreasInformacionRepository.findOneBy({ id: horarioFechas.idArea });

      if (!areaInformacion)  return new GenericResponse('400',`areaInformacion con ID ${horarioFechas.idArea} no encontrado`, []);

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

            horariosCitas.push({
              id: horario.id,
              diaSemana: horario.diaSemana || diaSemana,
              fecha: fecha,
              horaInicio: intervalo.horaInicio,
              horaFinal: intervalo.horaFinal,
              disponibles: Math.max(0, areaInformacion.cantidadProgramacion - permisosCount),
              estado: permisosCount >= areaInformacion.cantidadProgramacion ? 0 : 1,
              idAreaGrupo: sucursalGrupoArea,
            });
          }
        }));
      };

      if (gruposFechas.length > 0) {

        await agregarHorarios(gruposFechas, horarioFechas.fecha);

      } else {

        const sucursalesAreasGruposHorarios = await this.SucursalesAreasGruposHorariosRepository.find({
          where: { idAreaGrupo: sucursalGrupoArea, diaSemana: diaSemana },
          relations: ['idAreaGrupo'],
        });

        await agregarHorarios(sucursalesAreasGruposHorarios, horarioFechas.fecha);
      }

      // Verificar si los horarios en horariosCitas están ocupados
      const permisos = await this.SucursalesAreasPermisosRepository.find({
        where: { idAreaGrupo: sucursalGrupoArea, fecha: horarioFechas.fecha }
      });

      horariosCitas.forEach(cita => {
        const permisoEncontrado = permisos.find(permiso =>
          permiso.horaInicio === cita.horaInicio &&
          permiso.horaFinal === cita.horaFinal &&
          permiso.fecha === cita.fecha
        );

        if (permisoEncontrado) {
          cita.estado = 0;
          cita.disponibles = 0;
        }
      });

      return new GenericResponse('200', `EXITO`, horariosCitas);

    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }


  async findAll() {

    try {
      const sucursalesAreasGruposHorarios = await this.SucursalesAreasGruposHorariosRepository.find({
        relations: ['idAreaGrupo.idSucursalArea.idSucursal.idEmpresa'],
      });
  
      return new GenericResponse('200', `EXITO`, sucursalesAreasGruposHorarios);

    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async findAllByGrupo(idGrupo: number) {

    try {

      const grupo = await this.SucursalesAreasGruposInformacionRepository.findOneBy({id: idGrupo});

      if(!grupo) return new GenericResponse('400', `No se encontro grupo`, []);

      const sucursalesAreasGruposHorarios = await this.SucursalesAreasGruposHorariosRepository.find({
        where:{idAreaGrupo:grupo},
        relations: ['idAreaGrupo.idSucursalArea'],
      });

      return new GenericResponse('200', `EXITO`, sucursalesAreasGruposHorarios);

    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async update(id: number, updateSucursalesAreasGruposHorarioDto: UpdateSucursalesAreasGruposHorarioDto) {

    try {

      const { idAreaGrupo, ...infoData } = updateSucursalesAreasGruposHorarioDto;

      const sucursales_areas_grupos_horario = await this.SucursalesAreasGruposHorariosRepository.findOneBy({ id });

      if (!sucursales_areas_grupos_horario) return new GenericResponse('400',`sucursales_areas_grupos_horario con ID ${id} no encontrado`, []);

      const SucursalesAreasGruposInformacion = await this.SucursalesAreasGruposInformacionRepository.findOneBy({ id: idAreaGrupo });

      if (!SucursalesAreasGruposInformacion)  return new GenericResponse('400',`SucursalesAreasGruposInformacion con ID ${idAreaGrupo} no encontrado`, []);

      const update_sucursales_areas_grupos_horario = this.SucursalesAreasGruposHorariosRepository.merge(sucursales_areas_grupos_horario, {
        ...infoData,
        idAreaGrupo: SucursalesAreasGruposInformacion
      });

      // Guardar los cambios en la base de datos
      await this.SucursalesAreasGruposHorariosRepository.save(update_sucursales_areas_grupos_horario);

      return new GenericResponse('200', `EXITO`, update_sucursales_areas_grupos_horario);

    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async remove(id: number) {

    try {

      const sucursales_areas_grupos_horario = await this.SucursalesAreasGruposHorariosRepository.findOne({ where: { id } });

      if (!sucursales_areas_grupos_horario) return new GenericResponse('400',`sucursales_areas_grupos_horario con ID ${id} no encontrado`, []);

      await this.SucursalesAreasGruposHorariosRepository.remove(sucursales_areas_grupos_horario);

      return new GenericResponse('200', `EXITO`, []);

    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

 
}
