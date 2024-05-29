import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateTiposUsuarioDto } from './dto/create-tipos_usuario.dto';
import { UpdateTiposUsuarioDto } from './dto/update-tipos_usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoUsuario } from '../entities/TipoUsuario';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { NivelesAcceso } from '../entities/NivelesAcceso';
import { userInfo } from 'os';

@Injectable()
export class TiposUsuarioService {

  private readonly logger = new Logger("TiposUsuarioService");

  constructor(
    @InjectRepository(TipoUsuario)
    private tipos_usuariosRepository: Repository<TipoUsuario>,

    @InjectRepository(NivelesAcceso)
    private nivelAccesoRepository: Repository<NivelesAcceso>,

  ) { }

  async create(createTiposUsuarioDto: CreateTiposUsuarioDto) {

    try {

      const {nivel_id, ...infoData} = createTiposUsuarioDto;

      const nivelAcceso = await this.nivelAccesoRepository.findOneBy({ id: createTiposUsuarioDto.nivel_id });
  
      if (!nivelAcceso) {
        throw new NotFoundException(`Nivel de acceso con ID ${createTiposUsuarioDto.nivel_id} no encontrado`);
      }
  
      const tipoUsuario = this.tipos_usuariosRepository.create({
        ...infoData,
        nivel: nivelAcceso
      });
      
      await this.tipos_usuariosRepository.save(tipoUsuario);
  
      return tipoUsuario;
  
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const tipos_usuario = await this.tipos_usuariosRepository.find({
      skip: offset,
      take: limit,
    });
    
    return tipos_usuario;
  }

  async getNivelesAcceso(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const nivelesAcceso = await this.nivelAccesoRepository.find({
      skip: offset,
      take: limit,
    });
    
    return nivelesAcceso;
  }

  async findOne(id: number) {
    return this.tipos_usuariosRepository.findOneBy({ id });
  }

  async update(id: number, updateTiposUsuarioDto: UpdateTiposUsuarioDto) {
    try {
      const { nivel_id, ...infoData } = updateTiposUsuarioDto;
  
      // Buscar el tipo de usuario por ID
      const tipoUsuario = await this.tipos_usuariosRepository.findOneBy({ id });

      if (!tipoUsuario) {
        throw new NotFoundException(`Tipo de usuario con ID ${id} no encontrado`);
      }
  
      // Buscar el nivel de acceso por ID
      const nivelAcceso = await this.nivelAccesoRepository.findOneBy({ id: nivel_id });

      if (!nivelAcceso) {
        throw new NotFoundException(`Nivel de acceso con ID ${nivel_id} no encontrado`);
      }
  
      // Actualizar el tipo de usuario con los nuevos datos y el nivel de acceso
      const updatedTipoUsuario = this.tipos_usuariosRepository.merge(tipoUsuario, {
        ...infoData,
        nivel: nivelAcceso
      });
  
      // Guardar los cambios en la base de datos
      await this.tipos_usuariosRepository.save(updatedTipoUsuario);
  
      // Devolver el tipo de usuario actualizado
      return updatedTipoUsuario;
  
    } catch (error) {
      this.handleDBException(error);
    }
  }


  async remove(id: number) {

    try {

      const tipoUsuario = await this.findOne(id);

      if (!tipoUsuario) {
        throw new NotFoundException(`TipoUsuario con ID ${id} not encontrado`);
      }

      tipoUsuario.estado = 0;

      return await this.tipos_usuariosRepository.save(tipoUsuario);

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
