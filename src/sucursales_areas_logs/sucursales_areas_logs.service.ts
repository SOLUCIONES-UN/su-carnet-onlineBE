import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateSucursalesAreasLogDto } from './dto/create-sucursales_areas_log.dto';
import { UpdateSucursalesAreasLogDto } from './dto/update-sucursales_areas_log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SucursalesAreasLogs } from '../entities/SucursalesAreasLogs';
import { Between, Repository } from 'typeorm';
import { SucursalesAreasGruposPuertas } from '../entities/SucursalesAreasGruposPuertas';
import { SucursalesAreasPermisos } from '../entities/SucursalesAreasPermisos';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { SucursalesAreasGruposInformacion } from '../entities/SucursalesAreasGruposInformacion';
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

  async verificarCita(idLogCita: number, idUsuario: number) {

    try {

      const consulta = this.SucursalesAreasLogsRepository.findOneBy({id: idLogCita});

      if((await consulta).estado == 'RECH' || (await consulta).estado == 'APL') 
      return new GenericResponse('401', 'QR vencido ya fue utilizado anteriormente ', consulta);

      const logCita = await this.SucursalesAreasLogsRepository.findOneBy({ id: idLogCita });
  
      if (!logCita) return new GenericResponse('400', `El logCita con Id ${idLogCita} no encontrado`, null);
  
      const usuario = await this.UsuariosRepository.findOneBy({ id: idUsuario });
  
      const RegistroInformacion = await this.RegistroInformacionRepository.findOneBy({ idUsuario: usuario });
  
      const cita = await this.SucursalesAreasPermisosRepository.findOne({
        where: { idRegistro: RegistroInformacion, sucursalesAreasLogs: logCita },
        relations: ['idAreaGrupo.idSucursalArea.idSucursal.idEmpresa', 'idRegistro'],
      });
  
      if (!cita) return new GenericResponse('400', `La cita con log ${logCita.idSucursalAreaPermiso} no encontrada`, null);
  
      const areaGrupo = await this.SucursalesAreasGruposInformacionRepository.findOneBy(cita.idAreaGrupo);
  
      if (!areaGrupo) return new GenericResponse('400', `areaGrupo ${cita.idAreaGrupo} no encontrado`, null);
  
      const sucursales_areas_informacion = await this.SucursalesAreasInformacionRepository.findOne({
        where: {sucursalesAreasGruposInformacions: areaGrupo}
      });
  
      if (!sucursales_areas_informacion) return new GenericResponse('400', `sucursales_areas_informacion ${areaGrupo.idSucursalArea} no encontrado`, null);
  
      const [hours, minutes, seconds] = cita.horaFinal.split(':').map(Number);
    
      const now = new Date();
      const citaFecha = new Date(cita.fecha);
  
      const today = new Date(now.toISOString().slice(0, 10));
      const citaOnlyDate = new Date(citaFecha.toISOString().slice(0, 10));
  
      if (today.getTime() === citaOnlyDate.getTime()) {
  
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
      } else if (today.getTime() < citaOnlyDate.getTime()) {
        // La cita es en el futuro
        return new GenericResponse('200', `La cita es para la fecha ${cita.fecha}`, cita);
      } else {
        // La cita ya ha pasado
        return new GenericResponse('200', `La cita ya ha pasado, estaba para la fecha ${cita.fecha}`, cita);
      }
    } catch (error) {
      return new GenericResponse('500', `Error interno al verificar cita`, error);
    }
  }

  async obtenerToken(idUsuario:number){

    const usuario = await this.UsuariosRepository.findOneBy({id:idUsuario});

    if(!usuario){
      throw new NotFoundException(`usuario con IdRegistro ${idUsuario} no encontrado`);
    }

    return await this.DispositivosRepository.find({
      where: {idusuario: usuario}
    });
  }


  async consultarLog(id:number){
    return await this.SucursalesAreasLogsRepository.findOneBy({ id });
  }

  async visitasEnProceso() {
  
    return await this.SucursalesAreasLogsRepository.find({
      where: {
        estado: 'PRC'
      }
    });
  }

  async update(id: number, updateSucursalesAreasLogDto: UpdateSucursalesAreasLogDto) {
    try {
      const logVisitas = await this.SucursalesAreasLogsRepository.findOneBy({ id });
  
      if (!logVisitas) {
        throw new NotFoundException(`logVisitas con ID ${id} no encontrado`);
      }
  
      Object.assign(logVisitas, updateSucursalesAreasLogDto);
    
      await this.SucursalesAreasLogsRepository.save(logVisitas);
  
      const cita = await this.SucursalesAreasPermisosRepository.findOneBy({
        id: updateSucursalesAreasLogDto.idSucursalAreaPermiso,
      });
  
      if (!cita) {
        throw new NotFoundException(`Cita con ID ${updateSucursalesAreasLogDto.idSucursalAreaPermiso} no encontrada`);
      }
  
      if (logVisitas.estado === 'PRC' || logVisitas.estado === 'TER') {
        cita.estado = logVisitas.estado;
        await this.SucursalesAreasPermisosRepository.save(cita);
      }

      const citaActual = await this.SucursalesAreasPermisosRepository.findOneBy({id:logVisitas.idSucursalAreaPermiso.id});

      if(citaActual){
        citaActual.estado = logVisitas.estado;
        await this.SucursalesAreasPermisosRepository.save(citaActual);
      }
    
      return logVisitas;
  
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async enProceso(idCita: number){

    const SucursalesAreasPermisos = await this.SucursalesAreasPermisosRepository.findOneBy({ id: idCita });

    if(!SucursalesAreasPermisos){
      return new GenericResponse('400', `La cita con id ${idCita} no encontrada `, null);
    }

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
