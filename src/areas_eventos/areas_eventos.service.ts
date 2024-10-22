import { Injectable } from '@nestjs/common';
import { CreateAreasEventoDto } from './dto/create-areas_evento.dto';
import { UpdateAreasEventoDto } from './dto/update-areas_evento.dto';
import { AreasEventos } from '../entities/AreasEventos';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';

@Injectable()
export class AreasEventosService {
  constructor(
    @InjectRepository(AreasEventos)
    private areasEventosRepository: Repository<AreasEventos>,

    @InjectRepository(EmpresasInformacion)
    private empresasInformacionRepository: Repository<EmpresasInformacion>,
  ) {}

  async create(createAreasEventoDto: CreateAreasEventoDto) {
    try {
      const { precio, idEmpresa, ...areasData } = createAreasEventoDto;

      const empresa = await this.empresasInformacionRepository.findOne({
        where: { id: idEmpresa, estado: 1 },
      });

      if (!empresa) {
        return new GenericResponse(
          '400',
          `Empresa con id ${idEmpresa} no encontrada`,
          [],
        );
      }

      const areasEvento = this.areasEventosRepository.create({
        ...areasData,
        precio: precio ? precio : 0,
        idEmpresa: empresa,
        estado: 1,
      });

      this.areasEventosRepository.save(areasEvento);

      return new GenericResponse(
        '200',
        'Area de evento creada con exito',
        areasEvento,
      );
    } catch (error) {
      return new GenericResponse(
        '500',
        'Error al crear el area de evento',
        error,
      );
    }
  }

  async findAll() {
    try {
      const areasEvento = await this.areasEventosRepository.find({
        where: { estado: 1 },
      });

      return new GenericResponse(
        '200',
        'Areas de evento obtenidas con exito',
        areasEvento,
      );
    } catch (error) {
      return new GenericResponse(
        '500',
        'Error al obtener las areas de evento',
        error,
      );
    }
  }

  async findAllByEmpresa(id: number) {
    try {
      const empresa = await this.empresasInformacionRepository.findOneBy({
        id: id,
      });

      if (!empresa) {
        return new GenericResponse('400', `Empresa no encontrada`, []);
      }

      const areasEvento = await this.areasEventosRepository.find({
        where: { idEmpresa: empresa, estado: 1 },
      });

      return new GenericResponse(
        '200',
        'Areas de evento obtenidas con exito',
        areasEvento,
      );
    } catch (error) {
      return new GenericResponse('500', `Error `, error);
    }
  }

  async update(id: number, updateAreasEventoDto: UpdateAreasEventoDto) {
    try {
      const { precio, idEmpresa, ...areasData } = updateAreasEventoDto;

      const empresa = await this.empresasInformacionRepository.findOne({
        where: { id: idEmpresa, estado: 1 },
      });

      if (!empresa) {
        return new GenericResponse(
          '400',
          `Empresa con id ${idEmpresa} no encontrada`,
          [],
        );
      }

      const areasEvento = await this.areasEventosRepository.findOne({
        where: { idArea: id, estado: 1 },
      });

      if (!areasEvento) {
        return new GenericResponse(
          '400',
          `Area de evento con id ${id} no encontrada`,
          [],
        );
      }

      this.areasEventosRepository.update(id, {
        ...areasData,
        precio: precio ? precio : 0,
        idEmpresa: empresa,
      });

      return new GenericResponse(
        '200',
        'Area de evento actualizada con exito',
        areasEvento,
      );
    } catch (error) {
      return new GenericResponse('500', `Error `, error);
    }
  }

  remove(id: number) {
    try {
      const areasEvento = this.areasEventosRepository.findOne({
        where: { idArea: id, estado: 1 },
      });

      if (!areasEvento) {
        return new GenericResponse(
          '400',
          `Area de evento con id ${id} no encontrada`,
          [],
        );
      }

      this.areasEventosRepository.update(id, {
        estado: 0,
      });

      return new GenericResponse(
        '200',
        'Area de evento eliminada con exito',
        areasEvento,
      );
    } catch (error) {
      return new GenericResponse('500', `Error `, error);
    }
  }
}
