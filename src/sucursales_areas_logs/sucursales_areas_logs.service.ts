import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateSucursalesAreasLogDto } from './dto/create-sucursales_areas_log.dto';
import { UpdateSucursalesAreasLogDto } from './dto/update-sucursales_areas_log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SucursalesAreasLogs } from '../entities/SucursalesAreasLogs';
import { Repository } from 'typeorm';
import { SucursalesAreasGruposPuertas } from '../entities/SucursalesAreasGruposPuertas';
import { SucursalesAreasPermisos } from '../entities/SucursalesAreasPermisos';

@Injectable()
export class SucursalesAreasLogsService {

  private readonly logger = new Logger("SucursalesAreasLogsService");

  constructor(
    @InjectRepository(SucursalesAreasLogs)
    private SucursalesAreasLogsRepository: Repository<SucursalesAreasLogs>,

    @InjectRepository(SucursalesAreasPermisos)
    private SucursalesAreasPermisosRepository: Repository<SucursalesAreasPermisos>,

    @InjectRepository(SucursalesAreasGruposPuertas)
    private sucursalesAreasGruposPuertasRepository: Repository<SucursalesAreasGruposPuertas>

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
