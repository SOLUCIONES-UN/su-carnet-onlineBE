import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateRegistroAfiliacioneDto } from './dto/create-registro_afiliacione.dto';
import { RegistroAfiliaciones } from '../entities/RegistroAfiliaciones';
import { InjectRepository } from '@nestjs/typeorm';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { Repository } from 'typeorm';
import { Usuarios } from '../entities/Usuarios';
import { UpdateRegistroAfiliacioneDto } from './dto/update-registro_afiliacione.dto';
import { CreateNotificacioneDto } from '../notificaciones/dto/create-notificacione.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';

@Injectable()
export class RegistroAfiliacionesService {
  private readonly logger = new Logger('RegistroAfiliacionesService');

  constructor(
    @InjectRepository(RegistroAfiliaciones)
    private RegistroAfiliacionesRepository: Repository<RegistroAfiliaciones>,

    @InjectRepository(EmpresasInformacion)
    private empresaRepository: Repository<EmpresasInformacion>,

    @InjectRepository(Usuarios)
    private UsuariosRepository: Repository<Usuarios>,
  ) {}

  async create(createRegistroAfiliacioneDto: CreateRegistroAfiliacioneDto) {

    try {

      const verificarRegistro = await this.verificarAfiliacion(createRegistroAfiliacioneDto);

      if(verificarRegistro){
        return new GenericResponse('401', 'Ya estas afiliado a esta empresa', verificarRegistro);
      }
      
      const usuario = await this.UsuariosRepository.findOneBy({
        id: createRegistroAfiliacioneDto.idUsuario,
      });

      if (!usuario) {
        return new GenericResponse('400', `Usuario con id ${createRegistroAfiliacioneDto.idUsuario} no encontrado`, []);
      }

      const empresaInformacion = await this.empresaRepository.findOneBy({
        id: createRegistroAfiliacioneDto.idEmpresa,
      });

      if (!empresaInformacion) {
        return new GenericResponse('400', `Empresa con id ${createRegistroAfiliacioneDto.idEmpresa} no encontrada `, []);
      }

      let fechaInicioAfiliacion = null;

      if (createRegistroAfiliacioneDto.estado === 'PEN') {
        fechaInicioAfiliacion = null;
      } else if (createRegistroAfiliacioneDto.estado != 'PEN') {
        fechaInicioAfiliacion = new Date();
      }

      const RegistroAfiliaciones = this.RegistroAfiliacionesRepository.create({
        idEmpresa: empresaInformacion,
        idUsuario: usuario,
        fechaSolicitud: new Date(),
        fechaInicio: fechaInicioAfiliacion,
        estado: createRegistroAfiliacioneDto.estado,
      });

      await this.RegistroAfiliacionesRepository.save(RegistroAfiliaciones);

      return new GenericResponse('200', `EXITO`, RegistroAfiliaciones);
    } catch (error) {
      return new GenericResponse('500', `Error al crear `, error);
    }
  }

  async AceptarAfiliacion(
    id: number,
    updateRegistroAfiliacioneDto: UpdateRegistroAfiliacioneDto,
  ) {
    try {
      const usuario = await this.UsuariosRepository.findOneBy({
        id: updateRegistroAfiliacioneDto.idUsuario,
      });

      if (!usuario) {
        throw new NotFoundException(
          `usuario con ID ${updateRegistroAfiliacioneDto.idUsuario} no encontrado`,
        );
      }

      const empresaInformacion = await this.empresaRepository.findOneBy({
        id: updateRegistroAfiliacioneDto.idEmpresa,
      });

      if (!empresaInformacion) {
        throw new NotFoundException(
          `empresaInformacion con ID ${updateRegistroAfiliacioneDto.idEmpresa} no encontrada`,
        );
      }

      const RegistroAfiliacion =
        await this.RegistroAfiliacionesRepository.findOneBy({ id });

      if (!RegistroAfiliacion) {
        throw new NotFoundException(
          `RegistroAfiliacion con ID ${id} not encontrado`,
        );
      }
      const updateRegistroAfiliacion =
        this.RegistroAfiliacionesRepository.merge(RegistroAfiliacion, {
          idEmpresa: empresaInformacion,
          idUsuario: usuario,
          fechaInicio: new Date(),
          estado: updateRegistroAfiliacioneDto.estado,
        });

      return await this.RegistroAfiliacionesRepository.save(
        updateRegistroAfiliacion,
      );
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async verificarAfiliacion(
    createRegistroAfiliacioneDto: CreateRegistroAfiliacioneDto,
  ) {
    const { idEmpresa, idUsuario } = createRegistroAfiliacioneDto;

    const empresaInformacion = await this.empresaRepository.findOneBy({
      id: idEmpresa,
    });

    if (!empresaInformacion) {
      throw new NotFoundException(
        `empresaInformacion con ID ${idEmpresa} no encontrada`,
      );
    }

    const usuario = await this.UsuariosRepository.findOneBy({ id: idUsuario });

    if (!usuario) {
      throw new NotFoundException(`usuario con ID ${idUsuario} no encontrado`);
    }

    return await this.RegistroAfiliacionesRepository.findOne({
      where: { idEmpresa: empresaInformacion, idUsuario: usuario },
      relations: ['idEmpresa', 'idUsuario'],
    });
  }

  async afiliacionVencida(idEmpresa: number): Promise<boolean> {
    const empresa = await this.empresaRepository.findOneBy({ id: idEmpresa });

    if (!empresa) {
      throw new NotFoundException(
        `empresaInformacion con ID ${idEmpresa} no encontrada`,
      );
    }

    const afiliacion = await this.RegistroAfiliacionesRepository.findOneBy({
      idEmpresa: empresa,
    });

    if (!afiliacion) {
      throw new NotFoundException(
        `afiliacion con ID ${idEmpresa} no encontrada`,
      );
    }

    const fechaActual = new Date();
    const fechaInicioAfiliacion = new Date(afiliacion.fechaInicio);

    if (fechaInicioAfiliacion > fechaActual) {
      return false;
    }

    return true;
  }

  async findAll(idEmpresa: number, estado: string) {

    const whereCondition: any = {};
  
    if (idEmpresa !== 0) {
      whereCondition.idEmpresa = await this.empresaRepository.findOneBy({
        id: idEmpresa,
      });
    }
  
    if (estado !== 'TODOS') {
      whereCondition.estado = estado;
    }
  
    const registroAfiliaciones = await this.RegistroAfiliacionesRepository.find({
      where: whereCondition,
      relations: [
        'idEmpresa', 
        'idUsuario', 
        'idUsuario.registroInformacions'  
      ],
    });
  
    return registroAfiliaciones;
  }

  async findAllByEmpresa(idEmpresa: number) {

    const whereCondition: any = {};
  
    if (idEmpresa !== 0) {
      whereCondition.idEmpresa = await this.empresaRepository.findOneBy({
        id: idEmpresa,
      });
    }
  
    const registroAfiliaciones = await this.RegistroAfiliacionesRepository.find({
      where: whereCondition,
      relations: [
        'idEmpresa', 
        'idUsuario', 
        'idUsuario.registroInformacions'  
      ],
    });
  
    return registroAfiliaciones;
  }

  async afiliacionByUsuario(idUsuario: number) {
   
    const usuario = await this.UsuariosRepository.findOneBy({ id: idUsuario });

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    const registroAfiliaciones = await this.RegistroAfiliacionesRepository.find(
      {
        where: { idUsuario: usuario, estado: 'ACEP' },
        relations: ['idEmpresa', 'idUsuario'],
      },
    );

    if (registroAfiliaciones.length === 0) {
      throw new Error('No se encontraron afiliaciones para este usuario');
    }

    // Verificar que cada registro tenga un idEmpresa válido
    for (const registro of registroAfiliaciones) {
      if (!registro.idEmpresa) {
        throw new Error('Registro de afiliación con idEmpresa inválido');
      }
    }

    return registroAfiliaciones;
  }

  async remove(id: number) {
    try {
      const RegistroAfiliacion =
        await this.RegistroAfiliacionesRepository.findOneBy({ id });

      if (!RegistroAfiliacion) {
        throw new NotFoundException(
          `RegistroAfiliacion con ID ${id} not encontrado`,
        );
      }

      RegistroAfiliacion.estado = 'INA';
      return await this.RegistroAfiliacionesRepository.save(RegistroAfiliacion);
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
