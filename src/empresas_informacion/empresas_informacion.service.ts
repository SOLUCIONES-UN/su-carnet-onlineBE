import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateEmpresasInformacionDto } from './dto/create-empresas_informacion.dto';
import { UpdateEmpresasInformacionDto } from './dto/update-empresas_informacion.dto';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendedores } from '../entities/Vendedores';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class EmpresasInformacionService {

  private readonly logger = new Logger("EmpresasInformacionService");

  constructor(
    @InjectRepository(EmpresasInformacion)
    private empresaRepository: Repository<EmpresasInformacion>,

    @InjectRepository(Vendedores)
    private vendedoresRepository: Repository<Vendedores>,

  ) { }
  
  // Función para transformar la fecha
  transformDate(dateString: string): string {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  }

  async create(createEmpresasInformacionDto: CreateEmpresasInformacionDto) {

    try {
      
      const { idVendedor, ...infoData } = createEmpresasInformacionDto;
  
      const vendedor = await this.vendedoresRepository.findOneBy({ id: idVendedor });
  
      if (!vendedor) {
        throw new NotFoundException(`Vendedor con ID ${idVendedor} no encontrado`);
      }
  
      const fechaInicioTransformada = this.transformDate(createEmpresasInformacionDto.fechaInicio);
      const fechaVencimientoTransformada = this.transformDate(createEmpresasInformacionDto.fechaVencimiento);

      const empresa = this.empresaRepository.create({
        ...infoData,
        idVendedor: vendedor,
        fechaInicio: fechaInicioTransformada,
        fechaVencimiento: fechaVencimientoTransformada
      });
  
      await this.empresaRepository.save(empresa);
  
      return empresa; 

    } catch (error) {
      this.handleDBException(error);
    }
  }


  async findAll(PaginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = PaginationDto;

    const empresas = await this.empresaRepository.find({
      where: { estado: 1 },
      skip: offset,
      take: limit,
      relations: ['empresasDocumentos.idTipoDocumento','idVendedor'],
    });
    
    return empresas;
  }

  async findOne(id: number) {
    return this.empresaRepository.findOneBy({ id });
  }

  async GetEmpresaByDisclaimer(disclaimer: string) {
    return await this.empresaRepository.findOne({
      where: { disclaimer: disclaimer },
    });
  }

  async update(id: number, updateEmpresasInformacionDto: UpdateEmpresasInformacionDto) {
    
    try {
      
      const { idVendedor, ...infoData } = updateEmpresasInformacionDto;
  
      const empresa = await this.empresaRepository.findOneBy({ id });

      if (!empresa) {
        throw new NotFoundException(`Empresa con ID ${id} no encontrado`);
      }
  
      const vendedor = await this.vendedoresRepository.findOneBy({ id: idVendedor });

      if (!vendedor) {
        throw new NotFoundException(`vendedor con ID ${idVendedor} no encontrado`);
      }
  
      const fechaInicioTransformada = this.transformDate(updateEmpresasInformacionDto.fechaInicio);
      const fechaVencimientoTransformada = this.transformDate(updateEmpresasInformacionDto.fechaVencimiento);

      const updatedEmpresa = this.empresaRepository.merge(empresa, {
        ...infoData,
        idVendedor: vendedor,
        fechaInicio: fechaInicioTransformada,
        fechaVencimiento: fechaVencimientoTransformada
      });
  
      // Guardar los cambios en la base de datos
      await this.empresaRepository.save(updatedEmpresa);
  
      return updatedEmpresa;
  
    } catch (error) {
      this.handleDBException(error);
    }

  }

  async remove(id: number) {
    
    try {
      
      const empresa = await this.findOne(id);

      if(!empresa){
        throw new NotFoundException(`empresa con ID ${id} not encontrado`);
      }

      empresa.estado = 0;
      return await this.empresaRepository.save(empresa);

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
