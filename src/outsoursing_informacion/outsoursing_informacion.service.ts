import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateOutsoursingInformacionDto } from './dto/create-outsoursing_informacion.dto';
import { UpdateOutsoursingInformacionDto } from './dto/update-outsoursing_informacion.dto';
import { OutsoursingInformacion } from '../entities/OutsoursingInformacion';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { TipoRelacionEmpresas } from '../entities/TipoRelacionEmpresas';

@Injectable()
export class OutsoursingInformacionService {

  private readonly logger = new Logger("OutsoursingInformacionService");

  constructor(
    @InjectRepository(OutsoursingInformacion)
    private OutsoursingInformacionRepository: Repository<OutsoursingInformacion>,

    @InjectRepository(EmpresasInformacion)
    private empresaRepository: Repository<EmpresasInformacion>,

    @InjectRepository(TipoRelacionEmpresas)
    private TipoRelacionEmpresasRepository: Repository<TipoRelacionEmpresas>,

  ) { }


  // Función para transformar la fecha
  transformDate(dateString: string): string {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  }

  async create(createOutsoursingInformacionDto: CreateOutsoursingInformacionDto) {

    try {
      const { idEmpresa, idEmpresaRelacionada, idTipoRelacion, ...infoData } = createOutsoursingInformacionDto;

      const empresa = await this.empresaRepository.findOneBy({ id: idEmpresa });

      const empresaRelacionada = await this.empresaRepository.findOneBy({ id: idEmpresaRelacionada });

      const tipoRelacion = await this.TipoRelacionEmpresasRepository.findOneBy({ id: idTipoRelacion});

      if (!empresa) {
        throw new NotFoundException(`empresa con ID ${idEmpresa} no encontrada`);
      }

      if (!empresaRelacionada) {
        throw new NotFoundException(`empresaRelacionada con ID ${idEmpresaRelacionada} no encontrada`);
      }

      if (!tipoRelacion) {
        throw new NotFoundException(`tipoRelacion con ID ${idTipoRelacion} no encontrada`);
      }

      const fechaSolicitudTransformada = this.transformDate(createOutsoursingInformacionDto.fechaSolicitud);
      const fechaInicioTransformada = this.transformDate(createOutsoursingInformacionDto.fechaInicio);
      const fechaFinalizacionTransformada = this.transformDate(createOutsoursingInformacionDto.fechaFinalizacion);


      const OutsoursingInformacion = this.OutsoursingInformacionRepository.create({
        ...infoData,
        fechaInicio: fechaInicioTransformada,
        fechaSolicitud: fechaSolicitudTransformada,
        fechaFinalizacion: fechaFinalizacionTransformada,
        idEmpresa: empresa,
        idEmpresaRelacionada: empresaRelacionada,
        idTipoRelacion: tipoRelacion,
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
      where: {estado: 'ACT'},
      relations: ['idEmpresa', 'idEmpresaRelacionada', 'idTipoRelacion'],
    });

    return OutsoursingInformacion;
  }


  async update(id: number, updateOutsoursingInformacionDto: UpdateOutsoursingInformacionDto) {
    
    try {
      const { idEmpresa, idEmpresaRelacionada, idTipoRelacion, ...infoData } = updateOutsoursingInformacionDto;

      const OutsoursingInformacion = await this.OutsoursingInformacionRepository.findOneBy({id});

      const empresa = await this.empresaRepository.findOneBy({ id: idEmpresa });

      const empresaRelacionada = await this.empresaRepository.findOneBy({ id: idEmpresaRelacionada });

      const tipoRelacion = await this.TipoRelacionEmpresasRepository.findOneBy({ id: idTipoRelacion});

      if (!OutsoursingInformacion) {
        throw new NotFoundException(`OutsoursingInformacion con ID ${id} no encontrada`);
      }

      if (!empresa) {
        throw new NotFoundException(`empresa con ID ${idEmpresa} no encontrada`);
      }

      if (!empresaRelacionada) {
        throw new NotFoundException(`empresaRelacionada con ID ${idEmpresaRelacionada} no encontrada`);
      }

      if (!tipoRelacion) {
        throw new NotFoundException(`tipoRelacion con ID ${idTipoRelacion} no encontrada`);
      }


      const fechaSolicitudTransformada = this.transformDate(updateOutsoursingInformacionDto.fechaSolicitud);
      const fechaInicioTransformada = this.transformDate(updateOutsoursingInformacionDto.fechaInicio);
      const fechaFinalizacionTransformada = this.transformDate(updateOutsoursingInformacionDto.fechaFinalizacion);

      const update_OutsoursingInformacion = this.OutsoursingInformacionRepository.merge(OutsoursingInformacion, {
        ...infoData,
        fechaInicio: fechaInicioTransformada,
        fechaSolicitud: fechaSolicitudTransformada,
        fechaFinalizacion: fechaFinalizacionTransformada,
        idEmpresa: empresa,
        idEmpresaRelacionada: empresaRelacionada,
        idTipoRelacion: tipoRelacion,
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
