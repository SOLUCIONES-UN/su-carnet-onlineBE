import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateSucursalesInformacionDto } from './dto/create-sucursales_informacion.dto';
import { UpdateSucursalesInformacionDto } from './dto/update-sucursales_informacion.dto';
import { SucursalesInformacion } from '../entities/SucursalesInformacion';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';

@Injectable()
export class SucursalesInformacionService {
  private readonly logger = new Logger('SucursalesInformacionService');

  constructor(
    @InjectRepository(SucursalesInformacion)
    private sucursalesRepository: Repository<SucursalesInformacion>,

    @InjectRepository(EmpresasInformacion)
    private empresaRepository: Repository<EmpresasInformacion>,
  ) {}

  async create(createSucursalesInformacionDto: CreateSucursalesInformacionDto) {
    try {
      const { idEmpresa, ...infoData } = createSucursalesInformacionDto;

      const empresa = await this.empresaRepository.findOneBy({ id: idEmpresa });

      if (!empresa) {
        return new GenericResponse('400', `empresa no encontrada`, []);
      }

      const sucursal = this.sucursalesRepository.create({
        ...infoData,
        idEmpresa: empresa,
      });

      await this.sucursalesRepository.save(sucursal);

      return new GenericResponse('200', `EXITO`, sucursal);
    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async findAll() {
    try {
      const sucursales = await this.sucursalesRepository.find({
        where: { estado: 1 },
        relations: ['idEmpresa'],
      });

      return new GenericResponse('200', `EXITO`, sucursales);
    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async findAllByEmpresaId(idEmpresa: number) {
    try {
      const empresa = await this.empresaRepository.findOneBy({ id: idEmpresa });

      if (!empresa) {
        return new GenericResponse('400', `empresa no encontrada`, []);
      }

      const sucursales = await this.sucursalesRepository.find({
        where: { idEmpresa: empresa, estado: 1 },
        relations: [
          'sucursalesAreasInformacions',
          'sucursalesAreasInformacions.sucursalesAreasGruposInformacions',
        ],
      });

      const filteredSucursales = sucursales.map((sucursal) => ({
        ...sucursal,
        sucursalesAreasInformacions: sucursal.sucursalesAreasInformacions
          .filter((area) => area.estado === 1)
          .map((area) => ({
            ...area,
            sucursalesAreasGruposInformacions:
              area.sucursalesAreasGruposInformacions.filter(
                (grupo) => grupo.estado === 1,
              ),
          })),
      }));

      return new GenericResponse('200', `EXITO`, filteredSucursales);
    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async sucursalByEmpresaIdAndGrupo(idEmpresa: number) {
    try {
      const empresa = await this.empresaRepository.findOneBy({ id: idEmpresa });

      if (!empresa) {
        return new GenericResponse('400', `empresa no encontrada`, []);
      }

      const sucursales = await this.sucursalesRepository.find({
        where: { idEmpresa: empresa, estado: 1 },
        relations: [
          'sucursalesAreasInformacions',
          'sucursalesAreasInformacions.sucursalesAreasGruposInformacions',
        ],
      });

      return new GenericResponse('200', `EXITO`, sucursales);
    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async findOne(id: number) {
    return this.sucursalesRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateSucursalesInformacionDto: UpdateSucursalesInformacionDto,
  ) {
    try {
      const { idEmpresa, ...infoData } = updateSucursalesInformacionDto;

      const sucursal = await this.sucursalesRepository.findOneBy({ id });

      if (!sucursal) {
        return new GenericResponse('400', `sucursal no encontrada`, []);
      }

      const empresa = await this.empresaRepository.findOneBy({ id: idEmpresa });

      if (!empresa) {
        return new GenericResponse('400', `empresa no encontrada`, []);
      }
      const updateSucursal = this.sucursalesRepository.merge(sucursal, {
        ...infoData,
        idEmpresa: empresa,
      });

      // Guardar los cambios en la base de datos
      await this.sucursalesRepository.save(updateSucursal);

      return new GenericResponse('200', `EXITO`, updateSucursal);
    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async remove(id: number) {
    try {
      const sucursal = await this.sucursalesRepository.findOneBy({ id });

      if (!sucursal) {
        return new GenericResponse('400', `sucursal no encontrada`, []);
      }

      sucursal.estado = 0;
      await this.sucursalesRepository.save(sucursal);

      return new GenericResponse('200', `EXITO`, sucursal);
    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }
}
