import { Injectable } from '@nestjs/common';
import { CreateMunicipioDto } from './dto/create-municipio.dto';
import { UpdateMunicipioDto } from './dto/update-municipio.dto';
import { Municipios } from '../entities/Municipios';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Departamentos } from '../entities/Departamentos';
import { GenericResponse } from '../common/dtos/genericResponse.dto';

@Injectable()
export class MunicipiosService {

  constructor(

    @InjectRepository(Departamentos)
    private DepartamentosRepository: Repository<Departamentos>,

    @InjectRepository(Municipios)
    private MunicipiosRepository: Repository<Municipios>,

  ) { }

  async create(createMunicipioDto: CreateMunicipioDto) {
    
    try {

      const departamento = await this.DepartamentosRepository.findOneBy({id:createMunicipioDto.iddepartamento});

      if(!departamento) return new GenericResponse('400', `No se encontro el depatamento con id ${createMunicipioDto.iddepartamento}`, null);

      const municipio = this.MunicipiosRepository.create({
        iddepartamento: departamento,
        description: createMunicipioDto.descripcion
      });

      await this.MunicipiosRepository.save(municipio);
      return new GenericResponse('200', `EXITO`, municipio);
      
    } catch (error) {
      return new GenericResponse('500', `Error al guardar`, error);
    }
  }

  async findAll() {

    const municipios = await this.MunicipiosRepository.find({
      where: { estado: 1 },
      relations: ['iddepartamento', 'iddepartamento.idpais']
    });
    
    return new GenericResponse('200', `EXITO`, municipios);
  }

  async findOne(id: number) {
    return this.MunicipiosRepository.findOneBy({ id });
  }

  async update(id: number, updateMunicipioDto: UpdateMunicipioDto) {
    
    try {
  
      const municipio = await this.MunicipiosRepository.findOneBy({ id });

      const departamento = await this.DepartamentosRepository.findOneBy({id:updateMunicipioDto.iddepartamento});

      if(!municipio) return new GenericResponse('400', `No se encontro el municipio con id ${id}`, null);

      if (!departamento) return new GenericResponse('400', `No se encontro el departamento con id ${updateMunicipioDto.iddepartamento}`, null);
  
      const updateMunicipio = this.MunicipiosRepository.merge(municipio, {
        iddepartamento: departamento,
        description: updateMunicipioDto.descripcion
      });
  
      await this.MunicipiosRepository.save(updateMunicipio);
  
      return new GenericResponse('200', `EXITO`, updateMunicipio);
  
    } catch (error) {
      return new GenericResponse('500', `Error al editar`, error);
    }
  }

  async remove(id: number) {
    
    try {

      const municipio = await this.findOne(id);

      if (!municipio) return new GenericResponse('400', `No se encontro el municipio con id ${id}`, null);

      municipio.estado = 0;

      await this.MunicipiosRepository.save(municipio);

      return new GenericResponse('200', `EXITO`, municipio);

    } catch (error) {
      return new GenericResponse('500', `Error al eliminar`, error);
    }
  }
}
