import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateSucursalesAreasGruposPuertaDto } from './dto/create-sucursales_areas_grupos_puerta.dto';
import { SucursalesAreasGruposPuertas } from '../entities/SucursalesAreasGruposPuertas';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SucursalesAreasGruposInformacion } from '../entities/SucursalesAreasGruposInformacion';
import { SucursalesAreasPuertas } from '../entities/SucursalesAreasPuertas';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';

@Injectable()
export class SucursalesAreasGruposPuertasService {

  constructor(

    @InjectRepository(SucursalesAreasPuertas)
    private SucursalesAreasPuertasRepository: Repository<SucursalesAreasPuertas>,

    @InjectRepository(SucursalesAreasGruposPuertas)
    private puertasRepository: Repository<SucursalesAreasGruposPuertas>,

    @InjectRepository(SucursalesAreasGruposInformacion)
    private AreasGruposInformacionRepository: Repository<SucursalesAreasGruposInformacion>,

    @InjectRepository(EmpresasInformacion)
    private EmpresasInformacionRepository: Repository<EmpresasInformacion>,

  ) { }

  async create(createSucursalesAreasGruposPuertaDto: CreateSucursalesAreasGruposPuertaDto) {
    
    try {
      
      const { idAreaGrupo, idPuerta, ...infoData } = createSucursalesAreasGruposPuertaDto;
  
      const AreasPuertas = await this.SucursalesAreasPuertasRepository.findOneBy({ id: idPuerta });
  
      if (!AreasPuertas) return new GenericResponse('400', `No se encontro AreasPuertas con id ${idPuerta}`, null);

      const AreasGruposInformacion = await this.AreasGruposInformacionRepository.findOneBy({id:idAreaGrupo});

      if(!AreasGruposInformacion) return new GenericResponse('400', `No se encontro AreasGruposInformacion con id ${idAreaGrupo}`, null);

      const estaAsignada = await this.puertasRepository.findOne({
        where: {idPuerta:AreasPuertas, idAreaGrupo:AreasGruposInformacion}
      })

      if(estaAsignada) return new GenericResponse('401', `La puerta ya esta asignada`, estaAsignada); 
  
      const AreasGruposPuertas = this.puertasRepository.create({
        ...infoData,
        idPuerta: AreasPuertas,
        idAreaGrupo: AreasGruposInformacion
      });
  
      await this.puertasRepository.save(AreasGruposPuertas);
  
      return new GenericResponse('200', `EXITO`, AreasGruposPuertas);

    } catch (error) {
      return new GenericResponse('500', `Error al agregar`, error);
    }
  }

  async findAll(idEmpresa: number) {

    try {

      const empresa = await this.EmpresasInformacionRepository.findOneBy({ id: idEmpresa });
  
      if (!empresa) {
        return new GenericResponse('400', `Empresa no encontrada`, []);
      }
  
      const SucursalesAreasGruposPuertas = await this.puertasRepository
        .createQueryBuilder('puerta')
        .innerJoinAndSelect('puerta.idPuerta', 'puertaArea')
        .innerJoinAndSelect('puerta.idAreaGrupo', 'areaGrupo')
        .innerJoinAndSelect('areaGrupo.idSucursalArea', 'sucursalArea')
        .innerJoinAndSelect('sucursalArea.idSucursal', 'sucursal')
        .where('sucursal.idEmpresa = :idEmpresa', { idEmpresa })
        .getMany();
  
      return new GenericResponse('200', `EXITO`, SucursalesAreasGruposPuertas);
    } catch (error) {
      return new GenericResponse('500', `Error en el servidor`, error);
    }
  }


  async remove(id: number) {
    
    try {
      
      const SucursalesAreasGruposPuertas = await this.puertasRepository.findOne({ where: { id } });

      if(!SucursalesAreasGruposPuertas) return new GenericResponse('400', `SucursalesAreasGruposPuertas con id ${id} no contrado `, []);
      await this.puertasRepository.remove(SucursalesAreasGruposPuertas);

      return new GenericResponse('200', `EXITO`, SucursalesAreasGruposPuertas);

    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

}
