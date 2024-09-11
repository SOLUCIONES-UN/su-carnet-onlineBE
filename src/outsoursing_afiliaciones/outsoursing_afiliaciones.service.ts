import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateOutsoursingAfiliacioneDto } from './dto/create-outsoursing_afiliacione.dto';
import { OutsoursingAfiliaciones } from '../entities/OutsoursingAfiliaciones';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OutsoursingInformacion } from '../entities/OutsoursingInformacion';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { GenericResponse } from '../common/dtos/genericResponse.dto';

@Injectable()
export class OutsoursingAfiliacionesService {


  constructor(
    @InjectRepository(OutsoursingAfiliaciones)
    private OutsoursingAfiliacionesRepository: Repository<OutsoursingAfiliaciones>,

    @InjectRepository(OutsoursingInformacion)
    private OutsoursingInformacionRepository: Repository<OutsoursingInformacion>,

    @InjectRepository(RegistroInformacion)
    private RegistroInformacionRepository: Repository<RegistroInformacion>

  ) { }


  async create(createOutsoursingAfiliacioneDto: CreateOutsoursingAfiliacioneDto) {

    try {

      const { idOutsoursing, idRegistroInformacion, ...infoData } = createOutsoursingAfiliacioneDto;

      const OutsoursingInformacion = await this.OutsoursingInformacionRepository.findOneBy({ id: idOutsoursing });

      const RegistroInformacion = await this.RegistroInformacionRepository.findOneBy({ id: idRegistroInformacion });

      if (!OutsoursingInformacion)  return new GenericResponse('400', `OutsoursingInformacion con ID ${idOutsoursing} no encontrada`, []);

      if (!RegistroInformacion) return new GenericResponse('400', `RegistroInformacion con ID ${idRegistroInformacion} no encontrada`, []);

      const OutsoursingAfiliaciones = this.OutsoursingAfiliacionesRepository.create({
        ...infoData,
        fechaSolicitud: new Date(),
        idOutsoursing: OutsoursingInformacion,
        idRegistroInformacion: RegistroInformacion,
        estado: 'PEN'
      });

      await this.OutsoursingAfiliacionesRepository.save(OutsoursingAfiliaciones);

      return new GenericResponse('200', `EXITO`, OutsoursingAfiliaciones);

    } catch (error) {
      return new GenericResponse('500', `Error al crear `, error);
    }
  }

  async findAllByOutsoursingInformacion(idOutsoursing:number) {

    try {

      const outsoursingInformacion = await this.OutsoursingInformacionRepository.findOneBy({id: idOutsoursing});

      if(!outsoursingInformacion) return new GenericResponse('404', `No se encontro outsoursingInformacion`, []);
      
      const OutsoursingAfiliaciones = await this.OutsoursingAfiliacionesRepository.find({
        where: {idOutsoursing: outsoursingInformacion},
        relations: ['idOutsoursing', 'idRegistroInformacion'],
      });
  
      return new GenericResponse('200', `EXITO`, OutsoursingAfiliaciones);

    } catch (error) {
      return new GenericResponse('500', `Error al crear `, error);
    }
  }

  async findAll() {

    try {
      
      const OutsoursingAfiliaciones = await this.OutsoursingAfiliacionesRepository.find({
        relations: ['idOutsoursing', 'idRegistroInformacion'],
      });
  
      return new GenericResponse('200', `EXITO`, OutsoursingAfiliaciones);

    } catch (error) {
      return new GenericResponse('500', `Error al crear `, error);
    }
  }


  async aceptacion(id: number) {

    try {

      const OutsoursingAfiliaciones = await this.OutsoursingAfiliacionesRepository.findOneBy({ id });

      if (!OutsoursingAfiliaciones) return new GenericResponse('400', `OutsoursingAfiliaciones con ID ${id} not encontrado`, []);

      OutsoursingAfiliaciones.estado = 'ACEP';
      OutsoursingAfiliaciones.fechaInicio =  new Date(),
      await this.OutsoursingAfiliacionesRepository.save(OutsoursingAfiliaciones);

      return new GenericResponse('200', `EXITO`, OutsoursingAfiliaciones);

    } catch (error) {
      return new GenericResponse('500', `Error al crear `, error);
    }
  }

}
