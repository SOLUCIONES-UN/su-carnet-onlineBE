import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateOutsoursingInformacionDto } from './dto/create-outsoursing_informacion.dto';
import { UpdateOutsoursingInformacionDto } from './dto/update-outsoursing_informacion.dto';
import { OutsoursingInformacion } from '../entities/OutsoursingInformacion';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class OutsoursingInformacionService {

  private readonly logger = new Logger("OutsoursingInformacionService");

  constructor(
    @InjectRepository(OutsoursingInformacion)
    private OutsoursingInformacionRepository: Repository<OutsoursingInformacion>,

    @InjectRepository(EmpresasInformacion)
    private empresaRepository: Repository<EmpresasInformacion>,

  ) { }


  // Función para transformar la fecha
  transformDate(dateString: string): string {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  }

  async create(createOutsoursingInformacionDto: CreateOutsoursingInformacionDto) {

    try {
      const { idEmpresaPadre, idEmpresaHijo, ...infoData } = createOutsoursingInformacionDto;

      const empresaPadre = await this.empresaRepository.findOneBy({ id: idEmpresaPadre });

      const empresaHijo = await this.empresaRepository.findOneBy({ id: idEmpresaHijo });

      if (!empresaPadre) {
        throw new NotFoundException(`empresaPadre con ID ${idEmpresaPadre} no encontrada`);
      }

      if (!empresaHijo) {
        throw new NotFoundException(`empresaHijo con ID ${idEmpresaHijo} no encontrada`);
      }

      const fechaSolicitudTransformada = this.transformDate(createOutsoursingInformacionDto.fechaSolicitud);

      const fechaInicioTransformada = this.transformDate(createOutsoursingInformacionDto.fechaInicio);


      const OutsoursingInformacion = this.OutsoursingInformacionRepository.create({
        ...infoData,
        fechaInicio: fechaInicioTransformada,
        fechaSolicitud: fechaSolicitudTransformada,
        idEmpresaPadre: empresaPadre,
        idEmpresaHijo: empresaHijo,
        estado: 'ACT'
      });

      await this.OutsoursingInformacionRepository.save(OutsoursingInformacion);

      return OutsoursingInformacion;

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const OutsoursingInformacion = await this.OutsoursingInformacionRepository.find({
      skip: offset,
      take: limit,
      relations: ['idEmpresaPadre', 'idEmpresaHijo'],
    });

    return OutsoursingInformacion;
  }


  async update(id: number, updateOutsoursingInformacionDto: UpdateOutsoursingInformacionDto) {
    
    try {
      const { idEmpresaHijo, idEmpresaPadre, ...infoData } = updateOutsoursingInformacionDto;

      const OutsoursingInformacion = await this.OutsoursingInformacionRepository.findOneBy({ id });

      if (!OutsoursingInformacion) {
        throw new NotFoundException(`OutsoursingInformacion con ID ${id} no encontrada`);
      }

      const empresaPadre = await this.empresaRepository.findOneBy({ id: idEmpresaPadre });

      const empresaHijo = await this.empresaRepository.findOneBy({ id: idEmpresaHijo });

      if (!empresaPadre) {
        throw new NotFoundException(`empresaPadre con ID ${idEmpresaPadre} no encontrada`);
      }

      if (!empresaHijo) {
        throw new NotFoundException(`empresaHijo con ID ${idEmpresaHijo} no encontrada`);
      }

      const fechaSolicitudTransformada = this.transformDate(updateOutsoursingInformacionDto.fechaSolicitud);

      const fechaInicioTransformada = this.transformDate(updateOutsoursingInformacionDto.fechaInicio);

      const update_OutsoursingInformacion = this.OutsoursingInformacionRepository.merge(OutsoursingInformacion, {
        ...infoData,
        fechaInicio: fechaInicioTransformada,
        fechaSolicitud: fechaSolicitudTransformada,
        idEmpresaPadre: empresaPadre,
        idEmpresaHijo: empresaHijo,
      });

      // Guardar los cambios en la base de datos
      await this.OutsoursingInformacionRepository.save(update_OutsoursingInformacion);

      return update_OutsoursingInformacion;

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async cerrarRelacion(id: number) {

    try {

      const OutsoursingInformacion = await this.OutsoursingInformacionRepository.findOneBy({ id });

      if (!OutsoursingInformacion) {
        throw new NotFoundException(`OutsoursingInformacion con ID ${id} not encontrado`);
      }

      OutsoursingInformacion.estado = 'INA';
      return await this.OutsoursingInformacionRepository.save(OutsoursingInformacion);

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
