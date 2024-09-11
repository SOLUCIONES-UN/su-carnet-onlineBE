import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateOutsoursingServicioDto } from './dto/create-outsoursing_servicio.dto';
import { OutsoursingServicios } from '../entities/OutsoursingServicios';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OutsoursingInformacion } from '../entities/OutsoursingInformacion';
import { TipoServicios } from '../entities/TipoServicios';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';

@Injectable()
export class OutsoursingServiciosService {

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
  
      if (!outsoursingInformacion)  return new GenericResponse('400', `outsoursingInformacion con id ${createOutsoursingServicioDto.idOutsoursing} no encontrado`, []);

      const tipoServicios = await this.TipoServiciosRepository.findOneBy({id:createOutsoursingServicioDto.idServicio});

      if(!tipoServicios) return new GenericResponse('400', `tipoServicios con id ${createOutsoursingServicioDto.idServicio} no encontrado`, []);
  
      const outsoursingServicios = this.OutsoursingServiciosRepository.create({
        idOutsoursing: outsoursingInformacion,
        idServicio: tipoServicios
      });
  
      await this.OutsoursingServiciosRepository.save(outsoursingServicios);
  
      return new GenericResponse('200', `EXITO`, outsoursingServicios);

    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async findAll() {

    try {

      const outsoursingServicios = await this.OutsoursingServiciosRepository.find({
        relations: ['idOutsoursing', 'idServicio'],
      });

      return new GenericResponse('200', `EXITO`, outsoursingServicios);

    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  
  }


  async findAllByOutsoursingInformacion(idOutsoursingInformacion:number) {

    try {

      const OutsoursingInformacion = await this.OutsoursingInformacionRepository.findOneBy({id:idOutsoursingInformacion});

      if(!OutsoursingInformacion)  return new GenericResponse('400', `OutsoursingInformacion con id ${idOutsoursingInformacion} no encontrado`, []);

      const outsoursingServicios = await this.OutsoursingServiciosRepository.find({
        where: {idOutsoursing: OutsoursingInformacion},
        relations: ['idOutsoursing', 'idServicio'],
      });
      
      return new GenericResponse('200', `EXITO`, outsoursingServicios);

    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async remove(id: number) {
    
    try {
      
      const outsoursingServicios = await this.OutsoursingServiciosRepository.findOne({ where: { id } });

      if(!outsoursingServicios)  return new GenericResponse('400', `outsoursingServicios con ID ${id} not encontrado`, []);

      await this.OutsoursingServiciosRepository.remove(outsoursingServicios);

      return new GenericResponse('200', `EXITO`, outsoursingServicios);

    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

}
