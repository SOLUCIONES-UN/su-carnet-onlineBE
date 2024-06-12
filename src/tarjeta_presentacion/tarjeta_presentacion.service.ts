import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateTarjetaPresentacionDto } from './dto/create-tarjeta_presentacion.dto';
import { UpdateTarjetaPresentacionDto } from './dto/update-tarjeta_presentacion.dto';
import { TarjetaPresentacion } from '../entities/TarjetaPresentacion';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { Usuarios } from '../entities/Usuarios';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class TarjetaPresentacionService {

  private readonly logger = new Logger("TarjetaPresentacionService");

  constructor(
    @InjectRepository(TarjetaPresentacion)
    private TarjetaPresentacionRepository: Repository<TarjetaPresentacion>,

    @InjectRepository(EmpresasInformacion)
    private empresaRepository: Repository<EmpresasInformacion>,

    @InjectRepository(Usuarios)
    private UsuariosRepository: Repository<Usuarios>,

  ) { }

  async create(createTarjetaPresentacionDto: CreateTarjetaPresentacionDto) {
    
    try {
      
      const { idEmpresa, idUsuario, ...infoData } = createTarjetaPresentacionDto;
  
      const empresa = await this.empresaRepository.findOneBy({ id: idEmpresa });
      const usuario = await this.UsuariosRepository.findOneBy({ id: idUsuario });
  
      if (!empresa) {
        throw new NotFoundException(`Empresa con ID ${idEmpresa} no encontrada`);
      }

      if (!usuario) {
        throw new NotFoundException(`Empresa con ID ${idUsuario} no encontrada`);
      }
  
      const tarjeta_presentacion = this.TarjetaPresentacionRepository.create({
        ...infoData,
        idEmpresa: empresa,
        idUsuario: usuario
      });
  
      await this.TarjetaPresentacionRepository.save(tarjeta_presentacion);
  
      return tarjeta_presentacion; 

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const tarjetas_presentacion = await this.TarjetaPresentacionRepository.find({
      where: { estado: 1 },
      skip: offset,
      take: limit,
      relations: ['idEmpresa', 'idUsuario'],
    });
    
    return tarjetas_presentacion;
  }

  async findOne(id: number) {
    return this.TarjetaPresentacionRepository.findOneBy({ id });
  }

  async update(id: number, updateTarjetaPresentacionDto: UpdateTarjetaPresentacionDto) {
    
    try {
      const { idEmpresa, idUsuario, ...infoData } = updateTarjetaPresentacionDto;
  
      const tarjeta_presentacion = await this.TarjetaPresentacionRepository.findOneBy({ id });

      if (!tarjeta_presentacion) {
        throw new NotFoundException(`sucursal con ID ${id} no encontrada`);
      }
  
      const empresa = await this.empresaRepository.findOneBy({ id: idEmpresa });
      const usuario = await this.UsuariosRepository.findOneBy({ id: idEmpresa });

      if (!empresa) {
        throw new NotFoundException(`empresa con ID ${idEmpresa} no encontrada`);
      }
  
      const updateTarjetaPresentacion = this.TarjetaPresentacionRepository.merge(tarjeta_presentacion, {
        ...infoData,
        idEmpresa: empresa,
        idUsuario: usuario
      });
  
      // Guardar los cambios en la base de datos
      await this.TarjetaPresentacionRepository.save(updateTarjetaPresentacion);
  
      return updateTarjetaPresentacion;
  
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {
    
    try {
      
      const tarjeta_presentacion = await this.TarjetaPresentacionRepository.findOneBy({id});

      if(!tarjeta_presentacion){
        throw new NotFoundException(`tarjeta_presentacion con ID ${id} not encontrada`);
      }

      tarjeta_presentacion.estado = 0;
      return await this.TarjetaPresentacionRepository.save(tarjeta_presentacion);

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
