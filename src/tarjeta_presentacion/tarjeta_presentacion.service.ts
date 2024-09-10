import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateTarjetaPresentacionDto } from './dto/create-tarjeta_presentacion.dto';
import { UpdateTarjetaPresentacionDto } from './dto/update-tarjeta_presentacion.dto';
import { TarjetaPresentacion } from '../entities/TarjetaPresentacion';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { Usuarios } from '../entities/Usuarios';
import { GenericResponse } from '../common/dtos/genericResponse.dto';

@Injectable()
export class TarjetaPresentacionService {

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
  
      let empresa = null;

      if (idEmpresa !== null && idEmpresa !== undefined) {
        empresa = await this.empresaRepository.findOneBy({ id: idEmpresa });
        if (!empresa) {
          return new GenericResponse('400', 'Empresa no encontrada', []);
        }
      }
  
      const usuario = await this.UsuariosRepository.findOneBy({ id: idUsuario });

      if (!usuario) {
        return new GenericResponse('400', 'Usuario no encontrado', []);
      }
  
      const tarjeta_presentacion = this.TarjetaPresentacionRepository.create({
        ...infoData,
        idEmpresa: empresa, 
        idUsuario: usuario
      });
  
      await this.TarjetaPresentacionRepository.save(tarjeta_presentacion);
  
      return new GenericResponse('200', 'EXITO', tarjeta_presentacion);
    } catch (error) {
      return new GenericResponse('400', 'Error', error);
    }
  }

  async findAll() {

    try {

      const tarjetas_presentacion = await this.TarjetaPresentacionRepository.find({
        where: { estado: 1 },
        relations: ['idEmpresa', 'idUsuario'],
      });
      
      return new GenericResponse('200', 'EXITO', tarjetas_presentacion);
    } catch (error) {
      return new GenericResponse('400', 'Error', error);
    }
  }

  async findAllByUsers(idUsuario:number) {

    try {
      const usuario = { id: idUsuario } as Usuarios;

      const tarjetasPresentacion = await this.TarjetaPresentacionRepository.find({
        where: { idUsuario: usuario, estado:1 },
        relations: ['idEmpresa', 'idUsuario'],
      });
      
      return new GenericResponse('200', 'EXITO', tarjetasPresentacion);
    } catch (error) {
      return new GenericResponse('500', 'Error', error);
    }
  }

  async findOne(id: number) {
   
    try {
      
      const tarjetasPresentacion = await this.TarjetaPresentacionRepository.find({
        where: {id:id},
        relations: ['idEmpresa', 'idUsuario'],
      })

      return new GenericResponse('200', 'EXITO', tarjetasPresentacion);
    } catch (error) {
      return new GenericResponse('500', 'Error', error);
    }
  }

  async update(id: number, updateTarjetaPresentacionDto: UpdateTarjetaPresentacionDto) {
    
    try {
      const { idEmpresa, idUsuario, ...infoData } = updateTarjetaPresentacionDto;

      let empresa = null;

      if (idEmpresa !== null && idEmpresa !== undefined) {
        
        empresa = await this.empresaRepository.findOneBy({ id: idEmpresa });

        if (!empresa) {
          return new GenericResponse('400', 'Empresa no encontrada', []);
        }
      }
  
      const tarjeta_presentacion = await this.TarjetaPresentacionRepository.findOneBy({ id });

      if (!tarjeta_presentacion) {
        return new GenericResponse('400', 'tarjeta_presentacion no encontrada', []);
      }
  
      const usuario = await this.UsuariosRepository.findOneBy({ id: idUsuario });

      if(!usuario) return new GenericResponse('400', 'usuario no encontrado', []);
  
      const updateTarjetaPresentacion = this.TarjetaPresentacionRepository.merge(tarjeta_presentacion, {
        ...infoData,
        idEmpresa: empresa,
        idUsuario: usuario
      });
  
      await this.TarjetaPresentacionRepository.save(updateTarjetaPresentacion);
  
      return new GenericResponse('200', 'EXITO', updateTarjetaPresentacion);
  
    } catch (error) {
      return new GenericResponse('500', 'Error', error);
    }
  }

  async remove(id: number) {
    
    try {
      
      const tarjeta_presentacion = await this.TarjetaPresentacionRepository.findOneBy({id});

      if(!tarjeta_presentacion){
        return new GenericResponse('400', `tarjeta_presentacion con ID ${id} not encontrada`, []);
      }

      tarjeta_presentacion.estado = 0;
      await this.TarjetaPresentacionRepository.save(tarjeta_presentacion);

      return new GenericResponse('200', 'EXITO', tarjeta_presentacion);

    } catch (error) {
      return new GenericResponse('500', 'Error', error);
    }
  }
  
}
