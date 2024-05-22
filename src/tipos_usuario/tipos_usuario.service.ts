import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateTiposUsuarioDto } from './dto/create-tipos_usuario.dto';
import { UpdateTiposUsuarioDto } from './dto/update-tipos_usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoUsuario } from '../entities/TipoUsuario';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class TiposUsuarioService {

  private readonly logger = new Logger("TiposUsuarioService");

  constructor(
    @InjectRepository(TipoUsuario)
    private tipos_usuariosRepository: Repository<TipoUsuario>,

  ) { }

  async create(createTiposUsuarioDto: CreateTiposUsuarioDto) {

    try {
      const tipoUsuario = this.tipos_usuariosRepository.create(createTiposUsuarioDto);

      await this.tipos_usuariosRepository.save(tipoUsuario);

      return createTiposUsuarioDto;

    } catch (error) {
      this.handleDBException(error);
    }

  }

  async findAll(PaginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = PaginationDto;

    return this.tipos_usuariosRepository.find({
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: number) {
    return this.tipos_usuariosRepository.findOneBy({ id });
  }

  async update(id: number, updateTiposUsuarioDto: UpdateTiposUsuarioDto) {

    try {

      const tipo_usuario = await this.tipos_usuariosRepository.preload({
        id: id,
        ...updateTiposUsuarioDto
      })

      if (!tipo_usuario) throw new NotFoundException("No se encontro el tipo_usuario");

      await this.tipos_usuariosRepository.save(tipo_usuario);

      return updateTiposUsuarioDto;

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
    throw new InternalServerErrorException('Error al crear tipo de usuario');
  }
}
