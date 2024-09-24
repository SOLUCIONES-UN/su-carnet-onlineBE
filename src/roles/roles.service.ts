import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Roles } from '../entities/Roles';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GenericResponse } from '../common/dtos/genericResponse.dto';

@Injectable()
export class RolesService {

  constructor(

    @InjectRepository(Roles)
    private RolesRepository: Repository<Roles>,

  ) { }

  async create(createRoleDto: CreateRoleDto) {
    
    try {

      const tiposCuenta = this.RolesRepository.create({
        descripcion: createRoleDto.descripcion
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
  
      const updateRole = this.RolesRepository.merge(role, {
        descripcion: updateRoleDto.descripcion
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

      return await this.RolesRepository.save(role);

    } catch (error) {
      return new GenericResponse('500', `Error al eliminar`, error);
    }

  }
}
