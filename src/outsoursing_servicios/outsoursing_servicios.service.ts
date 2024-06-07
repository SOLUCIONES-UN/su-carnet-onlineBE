import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateOutsoursingServicioDto } from './dto/create-outsoursing_servicio.dto';
import { OutsoursingServicios } from '../entities/OutsoursingServicios';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OutsoursingInformacion } from '../entities/OutsoursingInformacion';
import { TipoServicios } from '../entities/TipoServicios';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class OutsoursingServiciosService {

  private readonly logger = new Logger("OutsoursingServiciosService");

  constructor(

    @InjectRepository(OutsoursingServicios)
    private OutsoursingServiciosRepository: Repository<OutsoursingServicios>,

    @InjectRepository(OutsoursingInformacion)
    private OutsoursingInformacionRepository: Repository<OutsoursingInformacion>,

    @InjectRepository(TipoServicios)
    private TipoServiciosRepository: Repository<TipoServicios>,

  ) { }

  async create(createOutsoursingServicioDto: CreateOutsoursingServicioDto) {
    
    try {
  
      const outsoursingInformacion = await this.OutsoursingInformacionRepository.findOneBy({ id: createOutsoursingServicioDto.idOutsoursing });
  
      if (!outsoursingInformacion) {
        throw new NotFoundException(`sucursalesAreasPuertas con ID ${createOutsoursingServicioDto.idOutsoursing} no encontrada`);
      }

      const tipoServicios = await this.TipoServiciosRepository.findOneBy({id:createOutsoursingServicioDto.idServicio});

      if(!tipoServicios){
        throw new NotFoundException(`tipoServicios con ID ${createOutsoursingServicioDto.idServicio} no encontrado`);
      }
  
      const outsoursingServicios = this.OutsoursingServiciosRepository.create({
        idOutsoursing: outsoursingInformacion,
        idServicio: tipoServicios
      });
  
      await this.OutsoursingServiciosRepository.save(outsoursingServicios);
  
      return outsoursingServicios; 

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const outsoursingServicios = await this.OutsoursingServiciosRepository.find({
      skip: offset,
      take: limit,
      relations: ['idOutsoursing', 'idServicio'],
    });
    
    return outsoursingServicios;
  }

  async remove(id: number) {
    
    try {
      
      const outsoursingServicios = await this.OutsoursingServiciosRepository.findOne({ where: { id } });

      if(!outsoursingServicios){
        throw new NotFoundException(`outsoursingServicios con ID ${id} not encontrado`);
      }
      return await this.OutsoursingServiciosRepository.remove(outsoursingServicios);

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
