import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateSucursalesAreasGruposInformacionDto } from './dto/create-sucursales_areas_grupos_informacion.dto';
import { UpdateSucursalesAreasGruposInformacionDto } from './dto/update-sucursales_areas_grupos_informacion.dto';
import { SucursalesAreasInformacion } from '../entities/SucursalesAreasInformacion';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SucursalesAreasGruposInformacion } from '../entities/SucursalesAreasGruposInformacion';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';

@Injectable()
export class SucursalesAreasGruposInformacionService {
  private readonly logger = new Logger(
    'SucursalesAreasGruposInformacionService',
  );

  constructor(
    @InjectRepository(SucursalesAreasInformacion)
    private sucursalesAreasRepository: Repository<SucursalesAreasInformacion>,

    @InjectRepository(SucursalesAreasGruposInformacion)
    private SucursalesAreasGruposRepository: Repository<SucursalesAreasGruposInformacion>,
  ) {}

  async create(
    createSucursalesAreasGruposInformacionDto: CreateSucursalesAreasGruposInformacionDto,
  ) {
    try {
      const { idSucursalArea, ...infoData } =
        createSucursalesAreasGruposInformacionDto;

      const area_sucursal = await this.sucursalesAreasRepository.findOneBy({
        id: idSucursalArea,
      });

      if (!area_sucursal)
        return new GenericResponse(
          '400',
          `area_sucursal con ID ${idSucursalArea} no encontrada`,
          [],
        );

      const areaGrupoSucursal = this.SucursalesAreasGruposRepository.create({
        ...infoData,
        idSucursalArea: area_sucursal,
      });

      await this.SucursalesAreasGruposRepository.save(areaGrupoSucursal);

      return new GenericResponse('200', `EXITO`, areaGrupoSucursal);
    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async findAll() {
    try {
      const areaaGruposSucursal =
        await this.SucursalesAreasGruposRepository.find({
          where: { estado: 1 },
          relations: ['idSucursalArea'],
        });

      return new GenericResponse('200', `EXITO`, areaaGruposSucursal);
    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async findAllByAreaInformacionId(idSucursalArea: number) {
    try {
      const sucursalAreaInformacion =
        await this.sucursalesAreasRepository.findOne({
          where: { estado: 1, id: idSucursalArea },
        });

      if (!sucursalAreaInformacion)
        return new GenericResponse(
          '400',
          `sucursalAreaInformacion con ID ${idSucursalArea} no encontrada puede estar inactivo`,
          [],
        );

      const SucursalesAreasGrupos =
        await this.SucursalesAreasGruposRepository.find({
          where: { idSucursalArea: sucursalAreaInformacion, estado: 1 },
          relations: ['idSucursalArea'],
        });

      return new GenericResponse('200', `EXITO`, SucursalesAreasGrupos);
    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async findOne(id: number) {
    try {
      const SucursalesAreasGrupos =
        this.SucursalesAreasGruposRepository.findOneBy({ id });

      return new GenericResponse('200', `EXITO`, SucursalesAreasGrupos);
    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async update(
    id: number,
    updateSucursalesAreasGruposInformacionDto: UpdateSucursalesAreasGruposInformacionDto,
  ) {
    try {
      const { idSucursalArea, ...infoData } =
        updateSucursalesAreasGruposInformacionDto;

      const areaaGruposSucursal =
        await this.SucursalesAreasGruposRepository.findOneBy({ id });

      if (!areaaGruposSucursal)
        return new GenericResponse(
          '400',
          `areaaGruposSucursal con ID ${id} no encontrada`,
          [],
        );

      const areasucursal = await this.sucursalesAreasRepository.findOneBy({
        id: idSucursalArea,
      });

      if (!areasucursal)
        return new GenericResponse(
          '400',
          `areasucursal con ID ${idSucursalArea} no encontrada`,
          [],
        );

      const updateAreaGrupoSucursal =
        this.SucursalesAreasGruposRepository.merge(areaaGruposSucursal, {
          ...infoData,
          idSucursalArea: areasucursal,
        });

      // Guardar los cambios en la base de datos
      await this.SucursalesAreasGruposRepository.save(updateAreaGrupoSucursal);

      return new GenericResponse('200', `EXITO`, updateAreaGrupoSucursal);
    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async remove(id: number) {
    try {
      const areaGruposSucursal =
        await this.SucursalesAreasGruposRepository.findOneBy({ id });

      if (!areaGruposSucursal) {
        throw new NotFoundException(
          `areaGruposSucursal con ID ${id} no encontrada`,
        );
      }

      areaGruposSucursal.estado = 0;

      const groupDeleted = await this.SucursalesAreasGruposRepository.save(
        areaGruposSucursal,
      );

      return new GenericResponse('200', `EXITO`, groupDeleted);
    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }
}
