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

  findAll() {
    return `This action returns all roles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
