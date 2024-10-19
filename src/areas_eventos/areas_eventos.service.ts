import { Injectable } from '@nestjs/common';
import { CreateAreasEventoDto } from './dto/create-areas_evento.dto';
import { UpdateAreasEventoDto } from './dto/update-areas_evento.dto';
import { AreasEventos } from '../entities/AreasEventos';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AreasEventosService {
  constructor(
    @InjectRepository(AreasEventos)
    private areasEventosRepository: Repository<AreasEventos>,
  ) {}

  create(createAreasEventoDto: CreateAreasEventoDto) {
    return 'This action adds a new areasEvento';
  }

  findAll() {
    return `This action returns all areasEventos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} areasEvento`;
  }

  update(id: number, updateAreasEventoDto: UpdateAreasEventoDto) {
    return `This action updates a #${id} areasEvento`;
  }

  remove(id: number) {
    return `This action removes a #${id} areasEvento`;
  }
}
