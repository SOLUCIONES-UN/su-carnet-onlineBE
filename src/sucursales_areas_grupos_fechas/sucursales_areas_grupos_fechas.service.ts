import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateSucursalesAreasGruposFechaDto } from './dto/create-sucursales_areas_grupos_fecha.dto';
import { UpdateSucursalesAreasGruposFechaDto } from './dto/update-sucursales_areas_grupos_fecha.dto';
import { SucursalesAreasGruposFechas } from '../entities/SucursalesAreasGruposFechas';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SucursalesAreasGruposInformacion } from '../entities/SucursalesAreasGruposInformacion';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';

@Injectable()
export class SucursalesAreasGruposFechasService {

  constructor(
    @InjectRepository(SucursalesAreasGruposFechas)
    private SucursalesAreasGruposFechasRepository: Repository<SucursalesAreasGruposFechas>,

    @InjectRepository(SucursalesAreasGruposInformacion)
    private SucursalesAreasGruposInformacionRepository: Repository<SucursalesAreasGruposInformacion>,

    @InjectRepository(EmpresasInformacion)
    private EmpresasInformacionRepository: Repository<EmpresasInformacion>,

  ) { }

  // Función para transformar la fecha
  transformDate(dateString: string): string {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  }


  async create(createSucursalesAreasGruposFechaDto: CreateSucursalesAreasGruposFechaDto) {

    try {
  
      const { idAreaGrupo, fecha, horaInicio, horaFinal, ...infoData } = createSucursalesAreasGruposFechaDto;
  
      const SucursalesAreasGruposInformacion = await this.SucursalesAreasGruposInformacionRepository.findOneBy({ id: idAreaGrupo });
  
      if (!SucursalesAreasGruposInformacion) {
        return new GenericResponse('400', `SucursalesAreasGruposInformacion con ID ${idAreaGrupo} no encontrada`, []);
      }
  
      // Verificamos si ya existe un horario en esa fecha que se solape
      const existeHorarioSolapado = await this.SucursalesAreasGruposFechasRepository
        .createQueryBuilder('gruposFechas')
        .where('gruposFechas.idAreaGrupo = :idAreaGrupo', { idAreaGrupo })
        .andWhere('gruposFechas.fecha = :fecha', { fecha })
        .andWhere('(gruposFechas.horaInicio <= :horaFinal AND gruposFechas.horaFinal >= :horaInicio)', { horaInicio, horaFinal })
        .getOne();
  
      if (existeHorarioSolapado) {
        return new GenericResponse('401', `El horario ingresado se solapa con un horario existente de ${existeHorarioSolapado.horaInicio} a ${existeHorarioSolapado.horaFinal} en la fecha ${fecha}`, existeHorarioSolapado);
      }
      
      const Grupos_fechas = this.SucursalesAreasGruposFechasRepository.create({
        ...infoData,
        idAreaGrupo: SucursalesAreasGruposInformacion,
        fecha,
        horaInicio,
        horaFinal
      });
  
      await this.SucursalesAreasGruposFechasRepository.save(Grupos_fechas);
  
      return new GenericResponse('200', `EXITO`, Grupos_fechas);
  
    } catch (error) {
      return new GenericResponse('500', `Error`, error.message);
    }
  }
  

  async findAll() {

    try {
      const sucursalesAreasGruposHorarios = await this.SucursalesAreasGruposFechasRepository.find({
        relations: ['idAreaGrupo.idSucursalArea.idSucursal.idEmpresa'],
      });
  
      return new GenericResponse('200', `EXITO`, sucursalesAreasGruposHorarios);

    } catch (error) {
      return new GenericResponse('500', `Error`, error.message);
    }
  }

  async findAllByEmpresa(idEmpresa: number) {

    try {
  
      const empresa = await this.EmpresasInformacionRepository.findOneBy({ id: idEmpresa, estado: 1 });
  
      if (!empresa) {
        return new GenericResponse('400', `Empresa no encontrada o inactiva`, []);
      }
  
      const sucursalesAreasGruposHorarios = await this.SucursalesAreasGruposFechasRepository
        .createQueryBuilder('sucursalesAreasGruposFechas')
        .innerJoinAndSelect('sucursalesAreasGruposFechas.idAreaGrupo', 'areaGrupo')
        .innerJoinAndSelect('areaGrupo.idSucursalArea', 'sucursalArea')
        .innerJoinAndSelect('sucursalArea.idSucursal', 'sucursal')
        .innerJoinAndSelect('sucursal.idEmpresa', 'empresa')  
        .where('empresa.id = :idEmpresa', { idEmpresa })      
        .andWhere('empresa.estado = 1')                        
        .andWhere('sucursal.estado = 1')                       
        .andWhere('sucursalArea.estado = 1')                  
        .andWhere('areaGrupo.estado = 1')                      
        .getMany();
  
      return new GenericResponse('200', `EXITO`, sucursalesAreasGruposHorarios);
  
    } catch (error) {
      return new GenericResponse('500', `Error`, error.message);
    }
  }


  async update(id: number, updateSucursalesAreasGruposFechaDto: UpdateSucursalesAreasGruposFechaDto) {

    try {
      const { idAreaGrupo, ...infoData } = updateSucursalesAreasGruposFechaDto;

      const sucursales_areas_grupos_fechas = await this.SucursalesAreasGruposFechasRepository.findOneBy({ id });

      if (!sucursales_areas_grupos_fechas) return new GenericResponse('400',`sucursales_areas_grupos_fechas con ID ${id} no encontrada`, []);

      const SucursalesAreasGruposInformacion = await this.SucursalesAreasGruposInformacionRepository.findOneBy({ id: idAreaGrupo });

      if (!SucursalesAreasGruposInformacion) return new GenericResponse('400',`SucursalesAreasGruposInformacion con ID ${idAreaGrupo} no encontrada`, []);

      const update_sucursales_areas_grupos_fechas = this.SucursalesAreasGruposFechasRepository.merge(sucursales_areas_grupos_fechas, {
        ...infoData,
        idAreaGrupo: SucursalesAreasGruposInformacion
      });

      // Guardar los cambios en la base de datos
      await this.SucursalesAreasGruposFechasRepository.save(update_sucursales_areas_grupos_fechas);

      return new GenericResponse('200', `EXITO`, update_sucursales_areas_grupos_fechas);

    } catch (error) {
      return new GenericResponse('500', `Error`, error.message);
    }
  }

  async remove(id: number) {

    try {

      const sucursales_areas_grupos_fechas = await this.SucursalesAreasGruposFechasRepository.findOne({ where: { id } });

      if (!sucursales_areas_grupos_fechas) return new GenericResponse('400',`sucursales_areas_grupos_fechas con ID ${id} no encontrada`, []);

      await this.SucursalesAreasGruposFechasRepository.remove(sucursales_areas_grupos_fechas);

      return new GenericResponse('200', `EXITO`, sucursales_areas_grupos_fechas);

    } catch (error) {
      return new GenericResponse('500', `Error`, error.message);
    }
  }

  
}
