import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateVendedoreDto } from './dto/create-vendedore.dto';
import { UpdateVendedoreDto } from './dto/update-vendedore.dto';
import { Vendedores } from '../entities/Vendedores';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';

@Injectable()
export class VendedoresService {

  private readonly logger = new Logger("VendedoresService");

  constructor(
    @InjectRepository(Vendedores)
    private vendedoresRepository: Repository<Vendedores>,
  
  )
  { }

  async create(createVendedoreDto: CreateVendedoreDto) {
    
    try {

      const existCodigo = await this.vendedoresRepository.findOneBy({codigo:createVendedoreDto.codigo});

      if(existCodigo) return new GenericResponse('400', `El codigo para empleado ya se esta utilizando`, null);

      const vendedor = this.vendedoresRepository.create(createVendedoreDto);

      await this.vendedoresRepository.save(vendedor);

      return new GenericResponse('200', `EXITO`, vendedor);

    } catch (error) {
      return new GenericResponse('500', `Error al editar usuario de empresa `, error);
    }
  }

  async findAll() {

    try {
      
      const vendedores = await this.vendedoresRepository.find({
        where: { estado: 1 },
      });
      
      return new GenericResponse('200', `EXITO`, vendedores);
    } catch (error) {
      return new GenericResponse('500', `Error al editar usuario de empresa `, error);
    }
  }

  async findOne(id: number) {
    
    try {

      const vendedor = await this.vendedoresRepository.findOneBy({ id });
      return new GenericResponse('200', `EXITO`, vendedor);

    } catch (error) {
      return new GenericResponse('500', `Error al editar usuario de empresa `, error);
    }
  }

  async update(id: number, updateVendedoreDto: UpdateVendedoreDto) {

    try {

      const vendedor = await this.vendedoresRepository.findOneBy({ id });
      if (!vendedor) return new GenericResponse('404', `Vendedor con id ${id} no encontrado `, []);
  
      Object.assign(vendedor, updateVendedoreDto);
  
      // Guardar los cambios
      await this.vendedoresRepository.save(vendedor);
  
      return new GenericResponse('200', `EXITO`, vendedor);

    } catch (error) {
      return new GenericResponse('500', `Error al editar usuario de empresa `, error);
    }
  }

  async remove(id: number) {

    try {

      const vendedor = await this.vendedoresRepository.findOneBy({id:id});

      if (!vendedor) return new GenericResponse('404', `Vendedor con id ${id} no encontrado `, []);

      vendedor.estado = 0;
      await this.vendedoresRepository.save(vendedor);

      return new GenericResponse('200', `EXITO`, vendedor);

    } catch (error) {
      return new GenericResponse('500', `Error al editar usuario de empresa `, error);
    }
  }

}
