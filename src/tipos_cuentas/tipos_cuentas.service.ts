import { Injectable } from '@nestjs/common';
import { CreateTiposCuentaDto } from './dto/create-tipos_cuenta.dto';
import { UpdateTiposCuentaDto } from './dto/update-tipos_cuenta.dto';
import { Tiposcuentas } from '../entities/Tiposcuentas';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class TiposCuentasService {

  constructor(

    @InjectRepository(Tiposcuentas)
    private TiposcuentasRepository: Repository<Tiposcuentas>,

  ) { }

  async create(createTiposCuentaDto: CreateTiposCuentaDto) {
    
    try {

      const {...infoData} = createTiposCuentaDto;

      const tiposCuenta = this.TiposcuentasRepository.create({
        ...infoData,
      });

      await this.TiposcuentasRepository.save(tiposCuenta);
      return new GenericResponse('200', `EXITO`, tiposCuenta);
      
    } catch (error) {
      return new GenericResponse('500', `Error al guardar`, error);
    }
  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const Tiposcuentas = await this.TiposcuentasRepository.find({
      where: { estado: 1 },
      skip: offset,
      take: limit,
    });
    
    return new GenericResponse('200', `EXITO`, Tiposcuentas);
  }


  async findOne(id: number) {
    return this.TiposcuentasRepository.findOneBy({ id });
  }


  async update(id: number, updateTiposCuentaDto: UpdateTiposCuentaDto) {
    
    try {
      const{...infoData } = updateTiposCuentaDto;
  
      const tiposCuenta = await this.TiposcuentasRepository.findOneBy({ id });

      if (!tiposCuenta) {
        return new GenericResponse('400', `No se encontro tipo cuenta`, tiposCuenta);
      }
  
      const updatedTipoUsuario = this.TiposcuentasRepository.merge(tiposCuenta, {
        ...infoData,
      });
  
      await this.TiposcuentasRepository.save(updatedTipoUsuario);
  
      return new GenericResponse('200', `EXITO`, Tiposcuentas);
  
    } catch (error) {
      return new GenericResponse('500', `Error al editar`, error);
    }
  }

  async remove(id: number) {

    try {

      const tiposCuenta = await this.findOne(id);

      if (!tiposCuenta) {
        return new GenericResponse('400', `No se encontro tipo cuenta`, tiposCuenta);
      }

      tiposCuenta.estado = 0;

      return await this.TiposcuentasRepository.save(tiposCuenta);

    } catch (error) {
      return new GenericResponse('500', `Error al eliminar`, error);
    }

  }
}
