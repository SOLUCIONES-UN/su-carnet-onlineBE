import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateSucursalesAreasLogDto } from './dto/create-sucursales_areas_log.dto';
import { UpdateSucursalesAreasLogDto } from './dto/update-sucursales_areas_log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SucursalesAreasLogs } from '../entities/SucursalesAreasLogs';
import { Repository } from 'typeorm';
import { SucursalesAreasGruposPuertas } from '../entities/SucursalesAreasGruposPuertas';
import { SucursalesAreasPermisos } from '../entities/SucursalesAreasPermisos';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { SucursalesAreasGruposInformacion } from '../entities/SucursalesAreasGruposInformacion';
import { log } from 'console';
import { SucursalesAreasInformacion } from '../entities/SucursalesAreasInformacion';
import { Usuarios } from '../entities/Usuarios';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { Dispositivos } from '../entities/Dispositivos';

@Injectable()
export class SucursalesAreasLogsService {

  private readonly logger = new Logger("SucursalesAreasLogsService");

  constructor(
    @InjectRepository(SucursalesAreasLogs)
    private SucursalesAreasLogsRepository: Repository<SucursalesAreasLogs>,

    @InjectRepository(SucursalesAreasPermisos)
    private SucursalesAreasPermisosRepository: Repository<SucursalesAreasPermisos>,

    @InjectRepository(SucursalesAreasGruposPuertas)
    private sucursalesAreasGruposPuertasRepository: Repository<SucursalesAreasGruposPuertas>,

    @InjectRepository(SucursalesAreasGruposInformacion)
    private SucursalesAreasGruposInformacionRepository: Repository<SucursalesAreasGruposInformacion>,

    @InjectRepository(SucursalesAreasInformacion)
    private SucursalesAreasInformacionRepository: Repository<SucursalesAreasInformacion>,

    @InjectRepository(Usuarios)
    private UsuariosRepository: Repository<Usuarios>,

    @InjectRepository(RegistroInformacion)
    private RegistroInformacionRepository: Repository<RegistroInformacion>,

    @InjectRepository(Dispositivos)
    private DispositivosRepository: Repository<Dispositivos>,

  ) { }

  async create(createSucursalesAreasLogDto: CreateSucursalesAreasLogDto) {
    
    try {

      const { idPuerta, idSucursalAreaPermiso, ...infoData } = createSucursalesAreasLogDto;

      const sucursalesAreasGruposPuertas = await this.sucursalesAreasGruposPuertasRepository.findOneBy({ id: idPuerta });

      const SucursalesAreasPermisos = await this.SucursalesAreasPermisosRepository.findOneBy({ id: idSucursalAreaPermiso });

      if (!SucursalesAreasPermisos) {
        throw new NotFoundException(`SucursalesAreasPermisos con ID ${idSucursalAreaPermiso} no encontrada`);
      }

      const SucursalesAreasLogs = this.SucursalesAreasLogsRepository.create({
        ...infoData,
        idPuerta: sucursalesAreasGruposPuertas,
        idSucursalAreaPermiso: SucursalesAreasPermisos,
        fechaHoraGeneracion: new Date(),
        estado: 'PEN'
      });

      await this.SucursalesAreasLogsRepository.save(SucursalesAreasLogs);

      return SucursalesAreasLogs;

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async verificarCita(idLogCita: number, idUsuario:number){

    try {

      const logCita = await this.SucursalesAreasLogsRepository.findOneBy({id: idLogCita});

      if (!logCita) return new GenericResponse('400', `El logCita con Id ${idLogCita} no encontrado`, null);

      const usuario = await this.UsuariosRepository.findOneBy({id: idUsuario});

      const RegistroInformacion = await this.RegistroInformacionRepository.findOneBy({ idUsuario: usuario });

      const cita = await this.SucursalesAreasPermisosRepository.findOne({
        where: {idRegistro: RegistroInformacion, sucursalesAreasLogs: logCita},
        relations: ['idAreaGrupo.idSucursalArea.idSucursal.idEmpresa'],
      });

      if(!cita) return new GenericResponse('400', `La cita con log ${logCita.idSucursalAreaPermiso} no encontrada`, null);

      const areaGrupo = await this.SucursalesAreasGruposInformacionRepository.findOneBy(cita.idAreaGrupo);

      if(!areaGrupo) return new GenericResponse('400', `areaGrupo ${cita.idAreaGrupo} no encontrado`, null);

      const sucursales_areas_informacion = await this.SucursalesAreasInformacionRepository.findOneBy(areaGrupo.idSucursalArea);

      if(!sucursales_areas_informacion) return new GenericResponse('400', `sucursales_areas_informacion ${areaGrupo.idSucursalArea} no encontrado`, null);

      // Asumiendo que `cita.horaInicio` es un string en formato "HH:mm:ss" (o similar)
    const [hours, minutes, seconds] = cita.horaInicio.split(':').map(Number);
  
    const now = new Date();
    const citaFecha = new Date(cita.fecha); // Suponiendo que `cita.fecha` es de tipo Date

    // Validar si la fecha de la cita es hoy, en el futuro o en el pasado
    if (now.toDateString() === citaFecha.toDateString()) {
      // La cita es hoy
      const fechaHoraCita = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes,
        seconds || 0
      );

      if (now > fechaHoraCita) {
        return new GenericResponse('200', `La cita es hoy pero ya ha pasado el horario`, cita);
      } else {
        return new GenericResponse('200', `La cita es hoy y aún está vigente`, cita);
      }
    } else if (now < citaFecha) {
      // La cita es en el futuro
      return new GenericResponse('200', `La cita es para la fecha ${cita.fecha}`, cita);
    } else {
      // La cita ya ha pasado
      return new GenericResponse('200', `La cita ya ha pasado estaba para la fecha ${cita.fecha}`, cita);
    }

    } catch (error) {
      return new GenericResponse('500', `Error interno al verificar cita `, error);
    }
    
  }

  async obtenerToken(idUsuario:number){

    const usuario = await this.UsuariosRepository.findOneBy({id:idUsuario});

    if(!usuario){
      throw new NotFoundException(`usuario con IdRegistro ${idUsuario} no encontrado`);
    }

    return await this.DispositivosRepository.findOneBy({idusuario:usuario});
  }

  async update(id: number, updateSucursalesAreasLogDto: UpdateSucursalesAreasLogDto){

    try {

      const logVisitas = await this.SucursalesAreasLogsRepository.findOneBy({ id });

      if (!logVisitas) {
        throw new NotFoundException(`logVisitas con ID ${id} no encontrado`);
      }
  
      Object.assign(logVisitas, updateSucursalesAreasLogDto);
  
      // Guardar los cambios
      await this.SucursalesAreasLogsRepository.save(logVisitas);
  
      return logVisitas;

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async enProceso(idCita: number){

    const SucursalesAreasPermisos = await this.SucursalesAreasPermisosRepository.findOneBy({ id: idCita });

    return await this.SucursalesAreasLogsRepository.findOne({
      where: {idSucursalAreaPermiso: SucursalesAreasPermisos, estado: "PEN"},
      relations: ['idSucursalAreaPermiso'],
    });
  }

  
  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(`Error : ${error.message}`);
    throw new InternalServerErrorException('Error ');
  }

}
