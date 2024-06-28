import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateSucursalesInformacionDto } from './dto/create-sucursales_informacion.dto';
import { UpdateSucursalesInformacionDto } from './dto/update-sucursales_informacion.dto';
import { SucursalesInformacion } from '../entities/SucursalesInformacion';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { TipoSucursales } from '../entities/TipoSucursales';

@Injectable()
export class SucursalesInformacionService {

  private readonly logger = new Logger("SucursalesInformacionService");

  constructor(
    @InjectRepository(SucursalesInformacion)
    private sucursalesRepository: Repository<SucursalesInformacion>,

    @InjectRepository(EmpresasInformacion)
    private empresaRepository: Repository<EmpresasInformacion>,

    @InjectRepository(TipoSucursales)
    private TipoSucursalesRepository: Repository<TipoSucursales>,

  ) { }

  async create(createSucursalesInformacionDto: CreateSucursalesInformacionDto) {
    
    try {
      
      const { idEmpresa, tipoSucursal, ...infoData } = createSucursalesInformacionDto;
  
      const empresa = await this.empresaRepository.findOneBy({ id: idEmpresa });
  
      if (!empresa) {
        throw new NotFoundException(`Empresa con ID ${idEmpresa} no encontrada`);
      }

      const tipos_Sucursal = await this.TipoSucursalesRepository.findOneBy({ id: tipoSucursal });
  
      if (!tipos_Sucursal) {
        throw new NotFoundException(`tipos_Sucursal con ID ${tipoSucursal} no encontrada`);
      }
  
      const sucursal = this.sucursalesRepository.create({
        ...infoData,
        idEmpresa: empresa,
        tipoSucursal: tipos_Sucursal
      });
  
      await this.sucursalesRepository.save(sucursal);
  
      return sucursal; 

    } catch (error) {
      this.handleDBException(error);
    }

  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const sucursales = await this.sucursalesRepository.find({
      where: { estado: 1 },
      skip: offset,
      take: limit,
      relations: ['idEmpresa'],
    });
    
    return sucursales;
  }

  async findAllByEmpresaId(idEmpresa:number) {

    const empresa = await this.empresaRepository.findOneBy({ id: idEmpresa });
  
    const sucursales = await this.sucursalesRepository.find({
      where: { idEmpresa: empresa, estado: 1 },
      relations: [
        'sucursalesAreasInformacions',
        'sucursalesAreasInformacions.sucursalesAreasGruposInformacions',
      ],
    });
  
    return sucursales;
  }

  async sucursalByEmpresaIdAndGrupo(idEmpresa: number) {
    const empresa = await this.empresaRepository.findOneBy({ id: idEmpresa });
  
    const sucursales = await this.sucursalesRepository.find({
      where: { idEmpresa: empresa, estado: 1 },
      relations: [
        'sucursalesAreasInformacions',
        'sucursalesAreasInformacions.sucursalesAreasGruposInformacions',
      ],
    });
  
    return sucursales;
  }


  async findOne(id: number) {
    return this.sucursalesRepository.findOneBy({ id });
  }

  async update(id: number, updateSucursalesInformacionDto: UpdateSucursalesInformacionDto) {
    
    try {
      const { idEmpresa, tipoSucursal, ...infoData } = updateSucursalesInformacionDto;
  
      const sucursal = await this.sucursalesRepository.findOneBy({ id });

      if (!sucursal) {
        throw new NotFoundException(`sucursal con ID ${id} no encontrada`);
      }
  
      const empresa = await this.empresaRepository.findOneBy({ id: idEmpresa });

      if (!empresa) {
        throw new NotFoundException(`empresa con ID ${idEmpresa} no encontrada`);
      }

      const tipos_Sucursal = await this.TipoSucursalesRepository.findOneBy({ id: tipoSucursal });
  
      if (!tipos_Sucursal) {
        throw new NotFoundException(`tipos_Sucursal con ID ${tipoSucursal} no encontrada`);
      }
  
      const updateSucursal = this.sucursalesRepository.merge(sucursal, {
        ...infoData,
        idEmpresa: empresa,
        tipoSucursal: tipos_Sucursal
      });
  
      // Guardar los cambios en la base de datos
      await this.sucursalesRepository.save(updateSucursal);
  
      return updateSucursal;
  
    } catch (error) {
      this.handleDBException(error);
    }

  }

  async remove(id: number) {
    
    try {
      
      const sucursal = await this.sucursalesRepository.findOneBy({id});

      if(!sucursal){
        throw new NotFoundException(`sucursal con ID ${id} not encontrada`);
      }

      sucursal.estado = 0;
      return await this.sucursalesRepository.save(sucursal);

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
