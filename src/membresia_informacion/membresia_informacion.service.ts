import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateMembresiaInformacionDto } from './dto/create-membresia_informacion.dto';
import { UpdateMembresiaInformacionDto } from './dto/update-membresia_informacion.dto';
import { MembresiaInformacion } from '../entities/MembresiaInformacion';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { TipoMembresia } from '../entities/TipoMembresia';

@Injectable()
export class MembresiaInformacionService {

  private readonly logger = new Logger("MembresiaInformacionService");

  constructor(

    @InjectRepository(MembresiaInformacion)
    private MembresiaInformacionRepository: Repository<MembresiaInformacion>,

    @InjectRepository(EmpresasInformacion)
    private EmpresasInformacionRepository: Repository<EmpresasInformacion>,

    @InjectRepository(TipoMembresia)
    private TipoMembresiaRepository: Repository<TipoMembresia>,
  )
  { }
  
  async create(createMembresiaInformacionDto: CreateMembresiaInformacionDto) {
    
    try {
      
      const { empresa, tipoMembresia, ...infoData } = createMembresiaInformacionDto;
  
      const empresa_informacion = await this.EmpresasInformacionRepository.findOneBy({ id: empresa });
  
      if (!empresa_informacion) {
        throw new NotFoundException(`empresa_informacion con ID ${empresa} no encontrada`);
      }

      const tipo_membresia = await this.TipoMembresiaRepository.findOneBy({id: tipoMembresia});

      if (!tipo_membresia) {
        throw new NotFoundException(`tipo_membresia con ID ${tipoMembresia} no encontrada`);
      }
  
      const membresia_informacion = this.MembresiaInformacionRepository.create({
        ...infoData,
        empresa: empresa_informacion,
        tipoMembresia: tipo_membresia
      });
  
      await this.MembresiaInformacionRepository.save(membresia_informacion);
  
      return membresia_informacion; 

    } catch (error) {
      this.handleDBException(error);
    }

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

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(`Error : ${error.message}`);
    throw new InternalServerErrorException('Error ');
  }
}
