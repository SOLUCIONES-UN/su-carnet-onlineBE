import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateRegistroInformacionDto } from './dto/create-registro_informacion.dto';
import { UpdateRegistroInformacionDto } from './dto/update-registro_informacion.dto';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { TipoPaises } from '../entities/TipoPaises';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Usuarios } from '../entities/Usuarios';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { UsuariosRelacionEmpresas } from '../entities/UsuariosRelacionEmpresas';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { Municipios } from '../entities/Municipios';

@Injectable()
export class RegistroInformacionService {

  constructor(
    @InjectRepository(RegistroInformacion)
    private RegistroInformacionRepository: Repository<RegistroInformacion>,

    @InjectRepository(Municipios)
    private MunicipiosRepository: Repository<Municipios>,

    @InjectRepository(Usuarios)
    private UsuariosRepository: Repository<Usuarios>,

    @InjectRepository(EmpresasInformacion)
    private EmpresasInformacionRepository: Repository<EmpresasInformacion>,

    @InjectRepository(UsuariosRelacionEmpresas)
    private UsuariosRelacionEmpresasRepository: Repository<UsuariosRelacionEmpresas>,

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

      const { idMunicipio, nombres, apellidos, documento, telefono, correo, fechaNacimiento, ...infoData } = createRegistroInformacionDto;

      const municipio = await this.MunicipiosRepository.findOneBy({ id: idMunicipio });

      if (!municipio) {
        return new GenericResponse('401', `Municipios ${idMunicipio} not encontrado`, []);
      }

      const RegistroInformacion = this.RegistroInformacionRepository.create({
        ...infoData,
        idMunicipio: municipio,
        nombres: nombres,
        apellidos: apellidos,
        documento: documento,
        telefono: telefono,
        correo: correo,
        genero: createRegistroInformacionDto.genero,
        direccionRecidencia: createRegistroInformacionDto.direccionRecidencia,
        fechaNacimiento: fechaNacimiento,
        idUsuario: usuario,
        estado: 'ACT'
      });

      await this.RegistroInformacionRepository.save(RegistroInformacion);

      return new GenericResponse('200', `EXITO`, RegistroInformacion);

    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async findAllByUsuario(idUsuario: number) {

    const usuario = await this.UsuariosRepository.findOneBy({ id: idUsuario });
    return await this.RegistroInformacionRepository.findOneBy({ idUsuario: usuario });
  }


  async findAll() {

    try {

      const RegistroInformacion = await this.RegistroInformacionRepository.find({
        relations: ['idMunicipio', 'idUsuario.idTipo', 'idUsuario.usuariosRelacionEmpresas', 'idUsuario.usuariosRelacionEmpresas.idEmpresa',
          'idUsuario.usuariosRelacionEmpresas.idSucursal', 'idUsuario.usuariosRelacionEmpresas.idAreaSucursal'],
      });

      return new GenericResponse('200', `EXITO`, RegistroInformacion);
    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async findAllByEmpresa(idEmpresa: number) {

    // Verificar que la empresa exista
    const empresa = await this.EmpresasInformacionRepository.findOne({ where: { id: idEmpresa } });
    if (!empresa) {
      return new GenericResponse('4400', `Empresa no econtrada `, []);
    }

    const registroInformacion = await this.RegistroInformacionRepository.createQueryBuilder('registro')
      .leftJoinAndSelect('registro.idUsuario', 'usuario')
      .leftJoinAndSelect('usuario.idTipo', 'tipo')
      .leftJoinAndSelect('usuario.usuariosRelacionEmpresas', 'relacion')
      .leftJoinAndSelect('relacion.idEmpresa', 'empresa')
      .leftJoinAndSelect('relacion.idSucursal', 'sucursal')
      .leftJoinAndSelect('relacion.idAreaSucursal', 'areaSucursal')
      .leftJoinAndSelect('registro.idMunicipio', 'pais')
      .where('relacion.idEmpresa = :idEmpresa', { idEmpresa })
      .andWhere('relacion.estado = :estado', { estado: 1 })
      .andWhere('empresa.estado = :empresaEstado', { empresaEstado: 1 })
      .andWhere('relacion.idSucursal IS NOT NULL')
      .andWhere('relacion.idAreaSucursal IS NOT NULL')
      .andWhere('registro.estado = :registroEstado', { registroEstado: 'ACT' })
      .orderBy('usuario.id')

    return new GenericResponse('200', `EXITO`, registroInformacion);
  }


  async update(id: number, updateRegistroInformacionDto: UpdateRegistroInformacionDto) {

    try {

      const { idMunicipio, idUsuario, nombres, apellidos, documento, telefono, correo, fechaNacimiento, ...infoData } = updateRegistroInformacionDto;

      const registro_informacion = await this.RegistroInformacionRepository.findOneBy({ id });

      if (!registro_informacion) return new GenericResponse('400', `registro_informacion con id ${id} no encontrado `, []);

      const municipio = await this.MunicipiosRepository.findOneBy({ id: idMunicipio });

      if (!municipio) return new GenericResponse('400', `municipio con id ${idMunicipio} no encontrado `, []);

      const usuario = await this.UsuariosRepository.findOneBy({ id: idUsuario });

      if (!usuario) return new GenericResponse('400', `usuario con id ${idUsuario} no encontrado `, []);

      const update_registro_informacion = this.RegistroInformacionRepository.merge(registro_informacion, {
        ...infoData,
        idMunicipio: municipio,
        idUsuario: usuario
      });

      await this.RegistroInformacionRepository.save(update_registro_informacion);

      return new GenericResponse('200', `EXITO`, update_registro_informacion);

    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async remove(id: number) {

    try {

      const RegistroInformacion = await this.RegistroInformacionRepository.findOneBy({ id: id });

      if (!RegistroInformacion) {
        return new GenericResponse('401', `RegistroInformacion con ID ${id} not encontrado`, RegistroInformacion);
      }

      const usuario = await this.UsuariosRepository.findOneBy({ registroInformacions: RegistroInformacion });

      if (!usuario) {
        return new GenericResponse('401', `El usuario con ID ${id} not encontrado`, usuario);
      }

      usuario.estado = 0;
      await this.UsuariosRepository.save(usuario);

      const usuarioRelacionEmpresa = await this.UsuariosRelacionEmpresasRepository.findOneBy({ idUsuario: usuario });

      if (!usuarioRelacionEmpresa) {
        return new GenericResponse('401', `UsuarioRelacion con ID ${id} not encontrado`, usuarioRelacionEmpresa);
      }

      usuarioRelacionEmpresa.estado = 0;

      await this.UsuariosRelacionEmpresasRepository.save(usuarioRelacionEmpresa);

      RegistroInformacion.estado = 'INA';
      await this.RegistroInformacionRepository.save(RegistroInformacion);

      return new GenericResponse('200', `EXITO`, RegistroInformacion);

    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

}
