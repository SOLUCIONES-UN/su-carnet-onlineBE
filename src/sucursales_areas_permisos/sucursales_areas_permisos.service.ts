import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateSucursalesAreasPermisoDto } from './dto/create-sucursales_areas_permiso.dto';
import { UpdateSucursalesAreasPermisoDto } from './dto/update-sucursales_areas_permiso.dto';
import { SucursalesAreasPermisos } from '../entities/SucursalesAreasPermisos';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SucursalesAreasGruposInformacion } from '../entities/SucursalesAreasGruposInformacion';
import { TipoPermisos } from '../entities/TipoPermisos';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class SucursalesAreasPermisosService {

  private readonly logger = new Logger("SucursalesAreasPermisosService");

  constructor(
    @InjectRepository(SucursalesAreasPermisos)
    private SucursalesAreasPermisosRepository: Repository<SucursalesAreasPermisos>,

    @InjectRepository(SucursalesAreasGruposInformacion)
    private SucursalesAreasGruposInformacionRepository: Repository<SucursalesAreasGruposInformacion>,

    @InjectRepository(TipoPermisos)
    private TipoPermisosRepository: Repository<TipoPermisos>,

    @InjectRepository(RegistroInformacion)
    private RegistroInformacionRepository: Repository<RegistroInformacion>

  ) { }

  // Función para transformar la fecha
  transformDate(dateString: string): string {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  }

  async create(createSucursalesAreasPermisoDto: CreateSucursalesAreasPermisoDto) {

    try {

      const { idAreaGrupo, idPermiso, idRegistro, ...infoData } = createSucursalesAreasPermisoDto;

      const areaGrupo = await this.SucursalesAreasGruposInformacionRepository.findOneBy({ id: idAreaGrupo });

      const RegistroInformacion = await this.RegistroInformacionRepository.findOneBy({ id: idRegistro });

      const TipoPermisos = await this.TipoPermisosRepository.findOneBy({ id: idPermiso });

      if (!areaGrupo) {
        throw new NotFoundException(`areaGrupo con ID ${idAreaGrupo} no encontrada`);
      }

      if (!RegistroInformacion) {
        throw new NotFoundException(`RegistroInformacion con ID ${idRegistro} no encontrada`);
      }

      if (!TipoPermisos) {
        throw new NotFoundException(`TipoPermisos con ID ${idPermiso} no encontrada`);
      }

      const fechaTransformada = this.transformDate(createSucursalesAreasPermisoDto.fecha);

      const areaSucursalPermisos = this.SucursalesAreasPermisosRepository.create({
        ...infoData,
        idAreaGrupo: areaGrupo,
        idRegistro: RegistroInformacion,
        idPermiso: TipoPermisos,
        fecha: fechaTransformada,
        estado: 'ACT'
      });

      await this.SucursalesAreasPermisosRepository.save(areaSucursalPermisos);

      return areaSucursalPermisos;

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const areaSucursalPermisos = await this.SucursalesAreasPermisosRepository.find({
      skip: offset,
      take: limit,
      relations: ['idAreaGrupo', 'idRegistro', 'idPermiso'],
    });

    return areaSucursalPermisos;
  }

  async update(id: number, updateSucursalesAreasPermisoDto: UpdateSucursalesAreasPermisoDto) {

    try {
      const { idAreaGrupo, idPermiso, idRegistro, ...infoData } = updateSucursalesAreasPermisoDto;

      const areaSucursalPermisos = await this.SucursalesAreasPermisosRepository.findOneBy({ id });

      if (!areaSucursalPermisos) {
        throw new NotFoundException(`areaSucursalPermisos con ID ${id} no encontrada`);
      }

      const areaGrupo = await this.SucursalesAreasGruposInformacionRepository.findOneBy({ id: idAreaGrupo });

      const RegistroInformacion = await this.RegistroInformacionRepository.findOneBy({ id: idRegistro });

      const TipoPermisos = await this.TipoPermisosRepository.findOneBy({ id: idPermiso });

      if (!areaGrupo) {
        throw new NotFoundException(`areaGrupo con ID ${idAreaGrupo} no encontrada`);
      }

      if (!RegistroInformacion) {
        throw new NotFoundException(`RegistroInformacion con ID ${idRegistro} no encontrada`);
      }

      if (!TipoPermisos) {
        throw new NotFoundException(`TipoPermisos con ID ${idPermiso} no encontrada`);
      }

      const fechaTransformada = this.transformDate(updateSucursalesAreasPermisoDto.fecha);

      const updateAreaSucursalPermisos = this.SucursalesAreasPermisosRepository.merge(areaSucursalPermisos, {
        ...infoData,
        idAreaGrupo: areaGrupo,
        idPermiso: TipoPermisos,
        idRegistro: RegistroInformacion,
        fecha: fechaTransformada
      });

      // Guardar los cambios en la base de datos
      await this.SucursalesAreasPermisosRepository.save(updateAreaSucursalPermisos);

      return updateAreaSucursalPermisos;

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {

    try {

      const RegistroInformacion = await this.SucursalesAreasPermisosRepository.findOneBy({ id });

      if (!RegistroInformacion) {
        throw new NotFoundException(`RegistroInformacion con ID ${id} not encontrado`);
      }

      RegistroInformacion.estado = 'INA';
      return await this.SucursalesAreasPermisosRepository.save(RegistroInformacion);

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
