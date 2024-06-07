import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateRegistroDispositivoDto } from './dto/create-registro_dispositivo.dto';
import { RegistroDispositivos } from '../entities/RegistroDispositivos';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class RegistroDispositivosService {

  private readonly logger = new Logger("RegistroDispositivosService");

  constructor(
    @InjectRepository(RegistroDispositivos)
    private RegistroDispositivosRepository: Repository<RegistroDispositivos>,

    @InjectRepository(RegistroInformacion)
    private RegistroInformacionRepository: Repository<RegistroInformacion>

  ) { }

  // Función para transformar la fecha
  transformDate(dateString: string): string {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  }

  async create(createRegistroDispositivoDto: CreateRegistroDispositivoDto) {
    
    try {
      const { idRegistroInformacion, ...infoData } = createRegistroDispositivoDto;

      const registro_informacion = await this.RegistroInformacionRepository.findOneBy({ id: idRegistroInformacion });

      if (!registro_informacion) {
        throw new NotFoundException(`registro_informacion con ID ${idRegistroInformacion} no encontrada`);
      } 

      const fechaUltimoUso_Transformada = this.transformDate(createRegistroDispositivoDto.fechaUltimoUso);

      const RegistroDispositivos = this.RegistroDispositivosRepository.create({
        ...infoData,
        idRegistroInformacion: registro_informacion,
        fechaUltimoUso: fechaUltimoUso_Transformada,
        estado: 'ACT'
      });

      await this.RegistroDispositivosRepository.save(RegistroDispositivos);

      return RegistroDispositivos;

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const RegistroDispositivos = await this.RegistroDispositivosRepository.find({
      skip: offset,
      take: limit,
      relations: ['idRegistroInformacion'],
    });

    return RegistroDispositivos;
  }

  async DispositivoEnvio(id: number) {
   
    try {

      const RegistroDispositivos = await this.RegistroDispositivosRepository.findOneBy({ id });

      if (!RegistroDispositivos) {
        throw new NotFoundException(`RegistroDispositivos con ID ${id} not encontrado`);
      }

      RegistroDispositivos.estado = 'ENV';
      return await this.RegistroDispositivosRepository.save(RegistroDispositivos);

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
