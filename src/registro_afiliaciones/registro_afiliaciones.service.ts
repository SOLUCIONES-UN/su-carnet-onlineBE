import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateRegistroAfiliacioneDto } from './dto/create-registro_afiliacione.dto';
import { RegistroAfiliaciones } from '../entities/RegistroAfiliaciones';
import { InjectRepository } from '@nestjs/typeorm';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class RegistroAfiliacionesService {

  private readonly logger = new Logger("RegistroAfiliacionesService");

  constructor(
    @InjectRepository(RegistroAfiliaciones)
    private RegistroAfiliacionesRepository: Repository<RegistroAfiliaciones>,

    @InjectRepository(EmpresasInformacion)
    private empresaRepository: Repository<EmpresasInformacion>,

  ) { }

  // Función para transformar la fecha
  transformDate(dateString: string): string {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  }

  async create(createRegistroAfiliacioneDto: CreateRegistroAfiliacioneDto) {

    try {

      const { idEmpresa, ...infoData } = createRegistroAfiliacioneDto;

      const empresaInformacion = await this.empresaRepository.findOneBy({ id: idEmpresa });

      if (!empresaInformacion) {
        throw new NotFoundException(`empresaInformacion con ID ${idEmpresa} no encontrada`);
      }

      const fechaSolicitudTransformada = this.transformDate(createRegistroAfiliacioneDto.fechaSolicitud);
      const fechaInicioTransformada = this.transformDate(createRegistroAfiliacioneDto.fechaInicio);

      const RegistroAfiliaciones = this.RegistroAfiliacionesRepository.create({
        ...infoData,
        idEmpresa: empresaInformacion,
        fechaSolicitud: fechaSolicitudTransformada,
        fechaInicio: fechaInicioTransformada,
        estado: 'PEN'
      });

      await this.RegistroAfiliacionesRepository.save(RegistroAfiliaciones);

      return RegistroAfiliaciones;

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const RegistroAfiliaciones = await this.RegistroAfiliacionesRepository.find({
      skip: offset,
      take: limit,
      relations: ['idEmpresa'],
    });

    return RegistroAfiliaciones;
  }


  async remove(id: number) {

    try {

      const RegistroAfiliacion = await this.RegistroAfiliacionesRepository.findOneBy({ id });

      if (!RegistroAfiliacion) {
        throw new NotFoundException(`RegistroAfiliacion con ID ${id} not encontrado`);
      }

      RegistroAfiliacion.estado = 'INA';
      return await this.RegistroAfiliacionesRepository.save(RegistroAfiliacion);

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
