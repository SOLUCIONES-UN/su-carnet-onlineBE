import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateRegistroInformacionDto } from './dto/create-registro_informacion.dto';
import { UpdateRegistroInformacionDto } from './dto/update-registro_informacion.dto';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { TipoPaises } from '../entities/TipoPaises';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';
import * as bcrypt from 'bcrypt';
import { Usuarios } from '../entities/Usuarios';
import * as crypto from 'crypto';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';

@Injectable()
export class RegistroInformacionService {

  private readonly logger = new Logger("RegistroInformacionService");

  constructor(
    @InjectRepository(RegistroInformacion)
    private RegistroInformacionRepository: Repository<RegistroInformacion>,

    @InjectRepository(TipoPaises)
    private TipoPaisesRepository: Repository<TipoPaises>,

    @InjectRepository(Usuarios)
    private UsuariosRepository: Repository<Usuarios>,
    @InjectRepository(EmpresasInformacion)
    private EmpresasInformacionRepository: Repository<EmpresasInformacion>,

  ) { }

  // Función para transformar la fecha
  transformDate(dateString: string): string {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  }


  async existRegistro(Dpi: string) {

    return await this.RegistroInformacionRepository.findOneBy({ documento: Dpi });
  }


  async create(createRegistroInformacionDto: CreateRegistroInformacionDto, usuario: Usuarios) {

    try {

      const { idPais, nombres, apellidos, documento, telefono, correo, fechaNacimiento, ...infoData } = createRegistroInformacionDto;

      const TipoPaises = await this.TipoPaisesRepository.findOneBy({ id: idPais });

      if (!TipoPaises) {
        throw new NotFoundException(`TipoPaises con ID ${idPais} no encontrada`);
      }

      const RegistroInformacion = this.RegistroInformacionRepository.create({
        ...infoData,
        idPais: TipoPaises,
        nombres: nombres,
        apellidos: apellidos,
        documento: documento,
        telefono: telefono,
        correo: correo,
        fechaNacimiento: fechaNacimiento,
        idUsuario: usuario,
        estado: 'ACT'
      });

      await this.RegistroInformacionRepository.save(RegistroInformacion);

      return RegistroInformacion;

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAllByUsuario(idUsuario: number) {

    const usuario = await this.UsuariosRepository.findOneBy({ id: idUsuario });
    return await this.RegistroInformacionRepository.findOneBy({ idUsuario: usuario });
  }

  
  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;

    const RegistroInformacion = await this.RegistroInformacionRepository.find({
      skip: offset,
      take: limit,
      relations: ['idPais', 'idUsuario.idTipo','idUsuario.usuariosRelacionEmpresas', 'idUsuario.usuariosRelacionEmpresas.idEmpresa', 
        'idUsuario.usuariosRelacionEmpresas.idSucursal', 'idUsuario.usuariosRelacionEmpresas.idAreaSucursal'],
    });

    return RegistroInformacion;
  }

  async findAllByEmpresa(paginationDto: PaginationDto, idEmpresa: number) {
    const { limit = 10, offset = 0 } = paginationDto;
  
    // Verificar que la empresa exista
    const empresa = await this.EmpresasInformacionRepository.findOneBy({ id: idEmpresa });
    if (!empresa) {
      throw new Error('Empresa no encontrada');
    }
  
    // Obtener registros de información que están relacionados con usuarios pertenecientes a la empresa específica
    const registroInformacion = await this.RegistroInformacionRepository.createQueryBuilder('registro')
      .leftJoinAndSelect('registro.idUsuario', 'usuario')
      .leftJoinAndSelect('usuario.idTipo', 'tipo')
      .leftJoinAndSelect('usuario.usuariosRelacionEmpresas', 'relacion')
      .leftJoinAndSelect('relacion.idEmpresa', 'empresa')
      .leftJoinAndSelect('relacion.idSucursal', 'sucursal')
      .leftJoinAndSelect('relacion.idAreaSucursal', 'areaSucursal')
      .leftJoinAndSelect('registro.idPais', 'pais')
      .where('relacion.idEmpresa = :idEmpresa', { idEmpresa })
      .andWhere('relacion.estado = :estado', { estado: 1 })
      .andWhere('empresa.estado = :empresaEstado', { empresaEstado: 1 })
      .skip(offset)
      .take(limit)
      .getMany();
  
    return registroInformacion;
  }

  async update(id: number, updateRegistroInformacionDto: UpdateRegistroInformacionDto) {

    try {

      const { idPais, idUsuario, nombres, apellidos, documento, telefono, correo, fechaNacimiento, ...infoData } = updateRegistroInformacionDto;

      const registro_informacion = await this.RegistroInformacionRepository.findOneBy({ id });

      if (!registro_informacion) {
        throw new NotFoundException(`registro_informacion con ID ${id} no encontrado`);
      }

      const TipoPaises = await this.TipoPaisesRepository.findOneBy({ id: idPais });

      if (!TipoPaises) {
        throw new NotFoundException(`TipoPaises con ID ${idPais} no encontrado`);
      }

      const usuario = await this.UsuariosRepository.findOneBy({ id: idUsuario });

      if (!usuario) {
        throw new NotFoundException(`usuario con ID ${idUsuario} no encontrado`);
      }

      const update_registro_informacion = this.RegistroInformacionRepository.merge(registro_informacion, {
        ...infoData,
        idPais: TipoPaises,
        idUsuario: usuario
      });

      // Guardar los cambios en la base de datos
      await this.RegistroInformacionRepository.save(update_registro_informacion);

      return update_registro_informacion;

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {

    try {

      const RegistroInformacion = await this.RegistroInformacionRepository.findOneBy({ id });

      if (!RegistroInformacion) {
        throw new NotFoundException(`RegistroInformacion con ID ${id} not encontrado`);
      }

      RegistroInformacion.estado = 'INA';
      return await this.RegistroInformacionRepository.save(RegistroInformacion);

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
