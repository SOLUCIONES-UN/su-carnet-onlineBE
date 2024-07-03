import { Injectable, Logger } from '@nestjs/common';
import { CreateMembresiaInformacionDto } from './dto/create-membresia_informacion.dto';
import { UpdateMembresiaInformacionDto } from './dto/update-membresia_informacion.dto';
import { MembresiaInformacion } from '../entities/MembresiaInformacion';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MembresiaInformacionService {

  private readonly logger = new Logger("MembresiaInformacionService");

  constructor(

    @InjectRepository(MembresiaInformacion)
    private MembresiaInformacionRepository: Repository<MembresiaInformacion>,
  )
  { }
  
  create(createMembresiaInformacionDto: CreateMembresiaInformacionDto) {
    return 'This action adds a new membresiaInformacion';
  }

  findAll() {
    return `This action returns all membresiaInformacion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} membresiaInformacion`;
  }

  update(id: number, updateMembresiaInformacionDto: UpdateMembresiaInformacionDto) {
    return `This action updates a #${id} membresiaInformacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} membresiaInformacion`;
  }
}
