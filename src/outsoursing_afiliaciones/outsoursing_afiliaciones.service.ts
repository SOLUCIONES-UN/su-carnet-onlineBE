import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateOutsoursingAfiliacioneDto } from './dto/create-outsoursing_afiliacione.dto';
import { OutsoursingAfiliaciones } from '../entities/OutsoursingAfiliaciones';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OutsoursingInformacion } from '../entities/OutsoursingInformacion';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class OutsoursingAfiliacionesService {

  private readonly logger = new Logger("OutsoursingAfiliacionesService");

  constructor(
    @InjectRepository(OutsoursingAfiliaciones)
    private OutsoursingAfiliacionesRepository: Repository<OutsoursingAfiliaciones>,

    @InjectRepository(OutsoursingInformacion)
    private OutsoursingInformacionRepository: Repository<OutsoursingInformacion>,

    @InjectRepository(RegistroInformacion)
    private RegistroInformacionRepository: Repository<RegistroInformacion>

  ) { }

  // Función para transformar la fecha
  transformDate(dateString: string): string {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  }

  async create(createOutsoursingAfiliacioneDto: CreateOutsoursingAfiliacioneDto) {

    try {

      const { idOutsoursing, idRegistroInformacion, ...infoData } = createOutsoursingAfiliacioneDto;

      const OutsoursingInformacion = await this.OutsoursingInformacionRepository.findOneBy({ id: idOutsoursing });

      const RegistroInformacion = await this.RegistroInformacionRepository.findOneBy({ id: idRegistroInformacion });

      if (!OutsoursingInformacion) {
        throw new NotFoundException(`OutsoursingInformacion con ID ${idOutsoursing} no encontrada`);
      }

      if (!RegistroInformacion) {
        throw new NotFoundException(`RegistroInformacion con ID ${idRegistroInformacion} no encontrada`);
      }

      const fechaSolicitudTransformada = this.transformDate(createOutsoursingAfiliacioneDto.fechaSolicitud);
      const fechaInicioTransformada = this.transformDate(createOutsoursingAfiliacioneDto.fechaInicio);

      const OutsoursingAfiliaciones = this.OutsoursingAfiliacionesRepository.create({
        ...infoData,
        fechaSolicitud: fechaSolicitudTransformada,
        fechaInicio: fechaInicioTransformada,
        idOutsoursing: OutsoursingInformacion,
        idRegistroInformacion: RegistroInformacion,
        estado: 'PEN'
      });

      await this.OutsoursingAfiliacionesRepository.save(OutsoursingAfiliaciones);

      return OutsoursingAfiliaciones;

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const OutsoursingAfiliaciones = await this.OutsoursingAfiliacionesRepository.find({
      skip: offset,
      take: limit,
      relations: ['idOutsoursing', 'idRegistroInformacion'],
    });

    return OutsoursingAfiliaciones;
  }


  async solicitud(id: number) {

    try {

      const OutsoursingAfiliaciones = await this.OutsoursingAfiliacionesRepository.findOneBy({ id });

      if (!OutsoursingAfiliaciones) {
        throw new NotFoundException(`OutsoursingAfiliaciones con ID ${id} not encontrado`);
      }

      OutsoursingAfiliaciones.estado = 'SOLI';
      return await this.OutsoursingAfiliacionesRepository.save(OutsoursingAfiliaciones);

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async aceptacion(id: number) {

    try {

      const OutsoursingAfiliaciones = await this.OutsoursingAfiliacionesRepository.findOneBy({ id });

      if (!OutsoursingAfiliaciones) {
        throw new NotFoundException(`OutsoursingAfiliaciones con ID ${id} not encontrado`);
      }

      OutsoursingAfiliaciones.estado = 'ACEP';
      return await this.OutsoursingAfiliacionesRepository.save(OutsoursingAfiliaciones);

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
