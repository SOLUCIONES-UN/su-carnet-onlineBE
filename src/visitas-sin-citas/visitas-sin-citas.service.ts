import { Injectable } from '@nestjs/common';
import { CreateVisitasSinCitaDto } from './dto/create-visitas-sin-cita.dto';
import { UpdateVisitasSinCitaDto } from './dto/update-visitas-sin-cita.dto';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class VisitasSinCitasService {

  constructor(

    @InjectRepository(RegistroInformacion)
    private TiposcuentasRepository: Repository<RegistroInformacion>,

  ) { }

  async create(createVisitasSinCitaDto: CreateVisitasSinCitaDto) {
    return 'This action adds a new visitasSinCita';
  }

  async findAll() {
    return `This action returns all visitasSinCitas`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} visitasSinCita`;
  }

  async update(id: number, updateVisitasSinCitaDto: UpdateVisitasSinCitaDto) {
    return `This action updates a #${id} visitasSinCita`;
  }

  async remove(id: number) {
    return `This action removes a #${id} visitasSinCita`;
  }
}
