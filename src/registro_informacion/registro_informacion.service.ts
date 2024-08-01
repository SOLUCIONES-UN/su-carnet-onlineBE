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

      const dpi = await this.RegistroInformacionRepository.findOneBy({ documento: createRegistroInformacionDto.documento });

      if(dpi) return new GenericResponse('401', `Ya existe registro con el DPI ${createRegistroInformacionDto.documento}`, null);

      const email = await this.RegistroInformacionRepository.findOneBy({ correo: createRegistroInformacionDto.correo });

      if(email) return new GenericResponse('401', `Ya existe registro con el correo ${createRegistroInformacionDto.correo}`, null);

      const telefonoUser = await this.RegistroInformacionRepository.findOneBy({ correo: createRegistroInformacionDto.correo });

      if(telefonoUser) return new GenericResponse('401', `Ya existe registro con el telefono ${createRegistroInformacionDto.telefono}`, null);

      const { idPais, nombres, apellidos, documento, telefono, correo, fechaNacimiento, ...infoData } = createRegistroInformacionDto;

      const TipoPaises = await this.TipoPaisesRepository.findOneBy({ id: idPais });

      if (!TipoPaises) {
        return new GenericResponse('401', `TipoPaises ${idPais} not encontrado`, TipoPaises);
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

      return new GenericResponse('200', `EXITO`, RegistroInformacion);

    } catch (error) {
      return new GenericResponse('500', `Eror al crear registro`, error);
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
    const empresa = await this.EmpresasInformacionRepository.findOne({ where: { id: idEmpresa } });
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
      .andWhere('relacion.idSucursal IS NOT NULL')
      .andWhere('relacion.idAreaSucursal IS NOT NULL')
      .andWhere('registro.estado = :registroEstado', { registroEstado: 'ACT' }) // Filtrar por estado 'ACT'
      .orderBy('usuario.id') // Puedes ordenar los resultados como prefieras
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
        return new GenericResponse('401', `registro_informacion ${id} not encontrado`, registro_informacion);
      }

      const TipoPaises = await this.TipoPaisesRepository.findOneBy({ id: idPais });

      if (!TipoPaises) {
        return new GenericResponse('401', `TipoPaises ${idPais} not encontrado`, registro_informacion);
      }

      const usuario = await this.UsuariosRepository.findOneBy({ id: idUsuario });

      if (!usuario) {
        return new GenericResponse('401', `usuario ${idUsuario} not encontrado`, registro_informacion);
      }

      const update_registro_informacion = this.RegistroInformacionRepository.merge(registro_informacion, {
        ...infoData,
        idPais: TipoPaises,
        idUsuario: usuario
      });

      // Guardar los cambios en la base de datos
      await this.RegistroInformacionRepository.save(update_registro_informacion);

      return new GenericResponse('200', `EXITO`, update_registro_informacion);

    } catch (error) {
      return new GenericResponse('500', `Error al editar`, error);
    }
  }

  async remove(id: number) {

    try {

      const RegistroInformacion = await this.RegistroInformacionRepository.findOneBy({id:id });

      if (!RegistroInformacion) {
        return new GenericResponse('401', `RegistroInformacion con ID ${id} not encontrado`, RegistroInformacion);
      }

      const usuario = await this.UsuariosRepository.findOneBy({registroInformacions: RegistroInformacion});

      if (!usuario) {
        return new GenericResponse('401', `El usuario con ID ${id} not encontrado`, usuario);
      }

      usuario.estado = 0;
      await this.UsuariosRepository.save(usuario);

      const usuarioRelacionEmpresa = await this.UsuariosRelacionEmpresasRepository.findOneBy({idUsuario: usuario});

      if (!usuarioRelacionEmpresa) {
        return new GenericResponse('401', `UsuarioRelacion con ID ${id} not encontrado`, usuarioRelacionEmpresa);
      }

      usuarioRelacionEmpresa.estado = 0;

      await this.UsuariosRelacionEmpresasRepository.save(usuarioRelacionEmpresa);
      
      RegistroInformacion.estado = 'INA';
      await this.RegistroInformacionRepository.save(RegistroInformacion);

      return new GenericResponse('200', `EXITO`, RegistroInformacion);

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
