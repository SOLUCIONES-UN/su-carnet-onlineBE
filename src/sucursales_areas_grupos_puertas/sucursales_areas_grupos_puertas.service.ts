import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateSucursalesAreasGruposPuertaDto } from './dto/create-sucursales_areas_grupos_puerta.dto';
import { SucursalesAreasGruposPuertas } from '../entities/SucursalesAreasGruposPuertas';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SucursalesAreasGruposInformacion } from '../entities/SucursalesAreasGruposInformacion';
import { SucursalesAreasPuertas } from '../entities/SucursalesAreasPuertas';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class SucursalesAreasGruposPuertasService {

  private readonly logger = new Logger("SucursalesAreasGruposPuertasService");

  constructor(

    @InjectRepository(SucursalesAreasPuertas)
    private SucursalesAreasPuertasRepository: Repository<SucursalesAreasPuertas>,

    @InjectRepository(SucursalesAreasGruposPuertas)
    private puertasRepository: Repository<SucursalesAreasGruposPuertas>,

    @InjectRepository(SucursalesAreasGruposInformacion)
    private AreasGruposInformacionRepository: Repository<SucursalesAreasGruposInformacion>,

  ) { }

  async create(createSucursalesAreasGruposPuertaDto: CreateSucursalesAreasGruposPuertaDto) {
    
    try {
      
      const { idAreaGrupo, idPuerta, ...infoData } = createSucursalesAreasGruposPuertaDto;
  
      const AreasPuertas = await this.SucursalesAreasPuertasRepository.findOneBy({ id: idPuerta });
  
      if (!AreasPuertas) {
        throw new NotFoundException(`sucursalesAreasPuertas con ID ${idPuerta} no encontrada`);
      }

      const AreasGruposInformacion = await this.AreasGruposInformacionRepository.findOneBy({id:idAreaGrupo});

      if(!AreasGruposInformacion){
        throw new NotFoundException(`AreasGruposInformacion con ID ${idAreaGrupo} no encontrado`);
      }
  
      const AreasGruposPuertas = this.puertasRepository.create({
        ...infoData,
        idPuerta: AreasPuertas,
        idAreaGrupo: AreasGruposInformacion
      });
  
      await this.puertasRepository.save(AreasGruposPuertas);
  
      return AreasGruposPuertas; 

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const SucursalesAreasGruposPuertas = await this.puertasRepository.find({
      skip: offset,
      take: limit,
      relations: ['idAreaGrupo', 'idPuerta'],
    });
    
    return SucursalesAreasGruposPuertas;
  }

  async remove(id: number) {
    
    try {
      
      const SucursalesAreasGruposPuertas = await this.puertasRepository.findOne({ where: { id } });

      if(!SucursalesAreasGruposPuertas){
        throw new NotFoundException(`SucursalesAreasGruposPuertas con ID ${id} not encontrado`);
      }
      return await this.puertasRepository.remove(SucursalesAreasGruposPuertas);

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
