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

  async verificarCita(idLogCita: number){

    try {

      const logCita = await this.SucursalesAreasLogsRepository.findOneBy({id: idLogCita});

      if (!logCita) return new GenericResponse('400', `El logCita con Id ${idLogCita} no encontrado`, null);

      const cita = await this.SucursalesAreasPermisosRepository.findOneBy(logCita.idSucursalAreaPermiso);

      if(!cita) return new GenericResponse('400', `La cita con log ${logCita.idSucursalAreaPermiso} no encontrada`, null);

      const areaGrupo = await this.SucursalesAreasGruposInformacionRepository.findOneBy(cita.idAreaGrupo);

      if(!areaGrupo) return new GenericResponse('400', `areaGrupo ${cita.idAreaGrupo} no encontrado`, null);

      const sucursales_areas_informacion = await this.SucursalesAreasInformacionRepository.findOneBy(areaGrupo.idSucursalArea);

      if(!sucursales_areas_informacion) return new GenericResponse('400', `sucursales_areas_informacion ${areaGrupo.idSucursalArea} no encontrado`, null);

      // if(sucursales_areas_informacion.tiempoQr )

    } catch (error) {
      
    }
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

    return await this.SucursalesAreasLogsRepository.find({
      where: {idSucursalAreaPermiso: SucursalesAreasPermisos},
      relations: ['idSucursalAreaPermiso'],
    });
  }

  
  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(`Error : ${error.message}`);
    throw new InternalServerErrorException('Error ');
  }

}
