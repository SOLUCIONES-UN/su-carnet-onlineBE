import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateMembresiaInformacionDto } from './dto/create-membresia_informacion.dto';
import { UpdateMembresiaInformacionDto } from './dto/update-membresia_informacion.dto';
import { MembresiaInformacion } from '../entities/MembresiaInformacion';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { TipoMembresia } from '../entities/TipoMembresia';
import { PaginationDto } from '../common/dtos/pagination.dto';

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

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const membresia_informacion = await this.MembresiaInformacionRepository.find({
      where: {estado: 1},
      skip: offset,
      take: limit,
    });
    
    return membresia_informacion;
  }

  async findOne(id: number) {
    return this.MembresiaInformacionRepository.findOneBy({ id });
  }

  async update(id: number, updateMembresiaInformacionDto: UpdateMembresiaInformacionDto) {
    
    try {

      const { empresa, tipoMembresia, ...infoData } = updateMembresiaInformacionDto;
  
      const empresa_informacion = await this.EmpresasInformacionRepository.findOneBy({ id: empresa });
  
      if (!empresa_informacion) {
        throw new NotFoundException(`empresa_informacion con ID ${empresa} no encontrada`);
      }

      const tipo_membresia = await this.TipoMembresiaRepository.findOneBy({id: tipoMembresia});

      if (!tipo_membresia) {
        throw new NotFoundException(`tipo_membresia con ID ${tipoMembresia} no encontrada`);
      }
  
      const membresia_informacion = await this.MembresiaInformacionRepository.findOneBy({id: id});

      if (!membresia_informacion) {
        throw new NotFoundException(`membresia_informacion con ID ${id} no encontrada`);
      }

      const update_membresiaInformacion = this.MembresiaInformacionRepository.merge(membresia_informacion, {
        ...infoData,
        empresa: empresa_informacion,
        tipoMembresia: tipo_membresia
      });
  
      // Guardar los cambios en la base de datos
      await this.MembresiaInformacionRepository.save(update_membresiaInformacion);
  
      return update_membresiaInformacion;

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {

    try {

      const membresia_informacion = await this.MembresiaInformacionRepository.findOneBy({id});

      if (!membresia_informacion) {
        throw new NotFoundException(`membresia_informacion con ID ${id} no encontrado`);
      }

      membresia_informacion.estado = 0;
      return await this.MembresiaInformacionRepository.save(membresia_informacion);

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
