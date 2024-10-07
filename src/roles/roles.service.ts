import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Roles } from '../entities/Roles';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';

@Injectable()
export class RolesService {

  constructor(

    @InjectRepository(Roles)
    private RolesRepository: Repository<Roles>,

    @InjectRepository(EmpresasInformacion)
    private EmpresasInformacionRepository: Repository<EmpresasInformacion>,

  ) { }

  async create(createRoleDto: CreateRoleDto) {
    
    try {

      const empresa = await this.EmpresasInformacionRepository.findOneBy({id:createRoleDto.empresaId});

      if(!empresa) return new GenericResponse('400', `La empresa con id ${createRoleDto.empresaId} no encontrada `, []);

      const tiposCuenta = this.RolesRepository.create({
        descripcion: createRoleDto.descripcion,
        empresa: empresa
      });

      await this.RolesRepository.save(tiposCuenta);
      return new GenericResponse('200', `EXITO`, tiposCuenta);
      
    } catch (error) {
      return new GenericResponse('500', `Error al guardar`, error);
    }
  }

  async findAll() {

    const roles = await this.RolesRepository.find({
      where: { estado: 1 },
      relations: ['empresa']
    });
    
    return new GenericResponse('200', `EXITO`, roles);
  }


  async findOne(id: number) {
    return this.RolesRepository.findOneBy({ id });
  }


  async update(id: number, updateRoleDto: UpdateRoleDto) {
    
    try {
  
      const role = await this.RolesRepository.findOneBy({ id:id });

      if (!role) {
        return new GenericResponse('400', `No se encontro el rol`, []);
      }

      const empresa = await this.EmpresasInformacionRepository.findOneBy({id:updateRoleDto.empresaId});

      if(!empresa) return new GenericResponse('400', `La empresa con id ${updateRoleDto.empresaId} no encontrada `, []);
  
      const updateRole = this.RolesRepository.merge(role, {
        descripcion: updateRoleDto.descripcion,
        empresa: empresa
      });
  
      await this.RolesRepository.save(updateRole);
  
      return new GenericResponse('200', `EXITO`, updateRole);
  
    } catch (error) {
      return new GenericResponse('500', `Error al editar`, error);
    }

  }

  async remove(id: number) {
    
    try {

      const role = await this.RolesRepository.findOneBy({id:id});

      if (!role) {
        return new GenericResponse('400', `No se encontro el rol`, []);
      }

      role.estado = 0;

      await this.RolesRepository.save(role);

      return new GenericResponse('200', `EXITO`, role);

    } catch (error) {
      return new GenericResponse('500', `Error al eliminar`, error);
    }

  }
}
