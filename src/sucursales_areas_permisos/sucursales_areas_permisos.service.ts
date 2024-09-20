import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateSucursalesAreasPermisoDto } from './dto/create-sucursales_areas_permiso.dto';
import { UpdateSucursalesAreasPermisoDto } from './dto/update-sucursales_areas_permiso.dto';
import { SucursalesAreasPermisos } from '../entities/SucursalesAreasPermisos';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SucursalesAreasGruposInformacion } from '../entities/SucursalesAreasGruposInformacion';
import { TipoPermisos } from '../entities/TipoPermisos';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { OutsoursingAfiliaciones } from '../entities/OutsoursingAfiliaciones';
import { Usuarios } from '../entities/Usuarios';
import { SucursalesAreasLogs } from '../entities/SucursalesAreasLogs';
import { GenericResponse } from '../common/dtos/genericResponse.dto';

@Injectable()
export class SucursalesAreasPermisosService {

  constructor(
    @InjectRepository(SucursalesAreasPermisos)
    private SucursalesAreasPermisosRepository: Repository<SucursalesAreasPermisos>,

    @InjectRepository(SucursalesAreasGruposInformacion)
    private SucursalesAreasGruposInformacionRepository: Repository<SucursalesAreasGruposInformacion>,

    @InjectRepository(TipoPermisos)
    private TipoPermisosRepository: Repository<TipoPermisos>,

    @InjectRepository(RegistroInformacion)
    private RegistroInformacionRepository: Repository<RegistroInformacion>,

    @InjectRepository(OutsoursingAfiliaciones)
    private OutsoursingAfiliacionesRepository: Repository<OutsoursingAfiliaciones>,

    @InjectRepository(Usuarios)
    private UsuariosRepository: Repository<Usuarios>,

    @InjectRepository(SucursalesAreasLogs)
    private SucursalesAreasLogsRepository: Repository<SucursalesAreasLogs>

  ) { }

  // Función para transformar la fecha
  transformDate(dateString: string): string {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  }

  async create(createSucursalesAreasPermisoDto: CreateSucursalesAreasPermisoDto) {

    try {

      const { idAreaGrupo, idPermiso, idUsuario, idOutsoursingAfiliaciones, ...infoData } = createSucursalesAreasPermisoDto;

      const areaGrupo = await this.SucursalesAreasGruposInformacionRepository.findOneBy({ id: idAreaGrupo });

      if (!areaGrupo) return new GenericResponse('400', `areaGrupo con id ${idAreaGrupo} no encontrado `, []);

      const usuario = await this.UsuariosRepository.findOneBy({id: idUsuario});

      if (!usuario) return new GenericResponse('400', `usuario con id ${idUsuario} no encontrado `, []);

      const RegistroInformacion = await this.RegistroInformacionRepository.findOneBy({ idUsuario: usuario });

      if (!RegistroInformacion) return new GenericResponse('400', `RegistroInformacion de usuario con ID  ${idUsuario} no encontrado `, []);

      const TipoPermisos = await this.TipoPermisosRepository.findOneBy({ id: idPermiso });

      const OutsoursingAfiliaciones = await this.OutsoursingAfiliacionesRepository.findOneBy({id: idOutsoursingAfiliaciones});

      const areaSucursalPermisos = this.SucursalesAreasPermisosRepository.create({
        ...infoData,
        idAreaGrupo: areaGrupo,
        idRegistro: RegistroInformacion,
        idOutsoursingAfiliaciones: OutsoursingAfiliaciones,
        idPermiso: TipoPermisos,
        fecha: createSucursalesAreasPermisoDto.fecha,
        estado: 'ACT'
      });

      await this.SucursalesAreasPermisosRepository.save(areaSucursalPermisos);

      return new GenericResponse('200', `EXITO`, areaSucursalPermisos);

    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async findAll() {

    try {
      
      const areaSucursalPermisos = await this.SucursalesAreasPermisosRepository.find({
        relations: ['idAreaGrupo', 'idRegistro.idUsuario'],
      });
  
      return new GenericResponse('200', `EXITO`, areaSucursalPermisos);

    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async citasArea(idAreaGrupo: number){

    try {
      
      const areaGrupo = await this.SucursalesAreasGruposInformacionRepository.findOneBy({id: idAreaGrupo});

      if(!areaGrupo) return new GenericResponse('400', `areaGrupo con id ${idAreaGrupo} no encontrada `, []);

      const areaSucursalPermisos = await this.SucursalesAreasPermisosRepository.find({
        where: {idAreaGrupo:areaGrupo},
        relations: ['idRegistro.idUsuario']
      });

      return new GenericResponse('200', `EXITO`, areaSucursalPermisos);

    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async citasUsuario(idUsuario: number) {

    try {
      
      const usuario = await this.UsuariosRepository.findOne({
        where: { id: idUsuario, estado: 2 }
      });
    
      if (!usuario) return new GenericResponse('400', `usuario con id ${idUsuario} no encontrado `, []);
    
      const registro_informacion = await this.RegistroInformacionRepository.findOne({
        where: { idUsuario: usuario, estado: 'ACT' }
      });
    
      if (!registro_informacion) return new GenericResponse('400', `registro_informacion con id  de usuario ${idUsuario} no encontrado `, []);
    
      const sucursalesAreasPermisos = await this.SucursalesAreasPermisosRepository.find({
        where: { idRegistro: registro_informacion },
        relations: ['idAreaGrupo.idSucursalArea.idSucursal.idEmpresa', 'idRegistro.idUsuario'],
      });
    
      const resultadosConInstrucciones = sucursalesAreasPermisos.map(item => {
        const informacion = item.idAreaGrupo.idSucursalArea.informacion;
        const instruccionesGenerales = informacion ? informacion : [];
        
        const instruccionesQr = item.idAreaGrupo.idSucursalArea.instruccionesQr;
        const instruccionesQrArray = instruccionesQr ? instruccionesQr : [];
    
        return {
          ...item,
          instruccionesGenerales,
          instruccionesQr: instruccionesQrArray,
        };
      });
    
      return new GenericResponse('200', `EXITO`, resultadosConInstrucciones);

    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async update(id: number, updateSucursalesAreasPermisoDto: UpdateSucursalesAreasPermisoDto) {

    try {
      const { idAreaGrupo, idPermiso, idUsuario, idOutsoursingAfiliaciones, ...infoData } = updateSucursalesAreasPermisoDto;

      const areaSucursalPermisos = await this.SucursalesAreasPermisosRepository.findOneBy({ id });

      if (!areaSucursalPermisos) return new GenericResponse('400', `areaSucursalPermisos con id  de usuario ${id} no encontrada `, []);

      const areaGrupo = await this.SucursalesAreasGruposInformacionRepository.findOneBy({ id: idAreaGrupo });

      const usuario = await this.UsuariosRepository.findOneBy({id: idUsuario});

      if (!usuario) return new GenericResponse('400', `usuario con id ${idUsuario} no encontrado `, []);

      const RegistroInformacion = await this.RegistroInformacionRepository.findOneBy({idUsuario: usuario });

      const TipoPermisos = await this.TipoPermisosRepository.findOneBy({ id: idPermiso });

      if (!areaGrupo) return new GenericResponse('400', `areaGrupo con id  de usuario ${idAreaGrupo} no encontrada `, []);

      if (!RegistroInformacion) return new GenericResponse('400', `RegistroInformacion con idUsuario ${idUsuario} no encontrado `, []);

      const OutsoursingAfiliaciones = await this.OutsoursingAfiliacionesRepository.findOneBy({id: idOutsoursingAfiliaciones});

      const updateAreaSucursalPermisos = this.SucursalesAreasPermisosRepository.merge(areaSucursalPermisos, {
        ...infoData,
        idAreaGrupo: areaGrupo,
        idPermiso: TipoPermisos,
        idOutsoursingAfiliaciones: OutsoursingAfiliaciones,
        idRegistro: RegistroInformacion,
        estado: updateSucursalesAreasPermisoDto.estado
      });
      await this.SucursalesAreasPermisosRepository.save(updateAreaSucursalPermisos);

      const logVisita = await this.SucursalesAreasLogsRepository.findOne({
        where: {idSucursalAreaPermiso: areaSucursalPermisos}
      });

      if(logVisita){

        if(updateSucursalesAreasPermisoDto.estado === 'TER'){
          logVisita.estado = 'TER';
          await this.SucursalesAreasLogsRepository.save(logVisita);
        }
      }

      return new GenericResponse('200', `EXITO`, updateAreaSucursalPermisos);

    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async remove(id: number) {

    try {

      const areaSucursalPermisos = await this.SucursalesAreasPermisosRepository.findOneBy({ id });

      if (!areaSucursalPermisos) {
        throw new NotFoundException(`areaSucursalPermisos con ID ${id} not encontrado`);
      }

      areaSucursalPermisos.estado = 'INA';
      await this.SucursalesAreasPermisosRepository.save(areaSucursalPermisos);

      return new GenericResponse('200', `EXITO`, areaSucursalPermisos);

    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

}
