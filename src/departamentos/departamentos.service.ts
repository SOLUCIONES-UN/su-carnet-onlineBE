import { Injectable } from '@nestjs/common';
import { CreateDepartamentoDto } from './dto/create-departamento.dto';
import { UpdateDepartamentoDto } from './dto/update-departamento.dto';
import { Departamentos } from '../entities/Departamentos';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { TipoPaises } from '../entities/TipoPaises';

@Injectable()
export class DepartamentosService {

  constructor(

    @InjectRepository(Departamentos)
    private DepartamentosRepository: Repository<Departamentos>,

    @InjectRepository(TipoPaises)
    private paisesRepository: Repository<TipoPaises>,

  ) { }

  async create(createDepartamentoDto: CreateDepartamentoDto) {
    
    try {

      const {...infoData} = createDepartamentoDto;

      const pais = await this.paisesRepository.findOneBy({id:createDepartamentoDto.idpais});

      if(!pais) return new GenericResponse('400', `No se encontro el Pais con id ${createDepartamentoDto.idpais}`, null);

      const departamento = this.DepartamentosRepository.create({
        ...infoData,
        idpais: pais
      });

      await this.DepartamentosRepository.save(departamento);
      return new GenericResponse('200', `EXITO`, departamento);
      
    } catch (error) {
      return new GenericResponse('500', `Error al guardar`, error);
    }
  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const departamentos = await this.DepartamentosRepository.find({
      where: { estado: 1 },
      relations:['idpais'],
      skip: offset,
      take: limit,
    });
    
    return new GenericResponse('200', `EXITO`, departamentos);
  }

  async findOne(id: number) {
    return this.DepartamentosRepository.findOneBy({ id });
  }

  async update(id: number, updateDepartamentoDto: UpdateDepartamentoDto) {
    
    try {
      const{...infoData } = updateDepartamentoDto;
  
      const departamento = await this.DepartamentosRepository.findOneBy({ id });

      const pais = await this.paisesRepository.findOneBy({id:updateDepartamentoDto.idpais});

      if(!pais) return new GenericResponse('400', `No se encontro el Pais con id ${updateDepartamentoDto.idpais}`, null);

      if (!departamento) return new GenericResponse('400', `No se encontro el departamento con id ${id}`, null);
  
      const updateDepartamento = this.DepartamentosRepository.merge(departamento, {
        ...infoData,
        idpais: pais
      });
  
      await this.DepartamentosRepository.save(updateDepartamento);
  
      return new GenericResponse('200', `EXITO`, updateDepartamento);
  
    } catch (error) {
      return new GenericResponse('500', `Error al editar`, error);
    }
  }

  async remove(id: number) {
    
    try {

      const departamento = await this.findOne(id);

      if (!departamento) return new GenericResponse('400', `No se encontro el departamento con id ${id}`, null);

      departamento.estado = 0;

      await this.DepartamentosRepository.save(departamento);

      return new GenericResponse('200', `EXITO`, departamento);

    } catch (error) {
      return new GenericResponse('500', `Error al eliminar`, error);
    }
  }
}
