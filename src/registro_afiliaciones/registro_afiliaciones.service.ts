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
import { In, Repository } from 'typeorm';
import { Usuarios } from '../entities/Usuarios';
import { UpdateRegistroAfiliacioneDto } from './dto/update-registro_afiliacione.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { CreateNotificacioneDto } from '../notificaciones/dto/create-notificacione.dto';
import { Dispositivos } from '../entities/Dispositivos';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { Console } from 'console';

@Injectable()
export class RegistroAfiliacionesService {
  constructor(
    @InjectRepository(RegistroAfiliaciones)
    private RegistroAfiliacionesRepository: Repository<RegistroAfiliaciones>,

    @InjectRepository(EmpresasInformacion)
    private empresaRepository: Repository<EmpresasInformacion>,

    @InjectRepository(Usuarios)
    private UsuariosRepository: Repository<Usuarios>,

    @InjectRepository(Dispositivos)
    private DispositivosRepository: Repository<Dispositivos>,

    private readonly notificacionesService: NotificacionesService,
  ) {}

  async create(createRegistroAfiliacioneDto: CreateRegistroAfiliacioneDto) {
    try {
      const usuario = await this.UsuariosRepository.findOneBy({
        id: createRegistroAfiliacioneDto.idUsuario,
      });

      if (!usuario) {
        return new GenericResponse(
          '400',
          `Usuario con id ${createRegistroAfiliacioneDto.idUsuario} no encontrado`,
          [],
        );
      }

      const empresaInformacion = await this.empresaRepository.findOneBy({
        id: createRegistroAfiliacioneDto.idEmpresa,
      });

      if (!empresaInformacion) {
        return new GenericResponse(
          '400',
          `Empresa con id ${createRegistroAfiliacioneDto.idEmpresa} no encontrada `,
          [],
        );
      }

      const verificarRegistro =
        await this.RegistroAfiliacionesRepository.findOne({
          where: {
            idEmpresa: empresaInformacion,
            idUsuario: usuario,
            estado: 'ACEP',
          },
          relations: ['idEmpresa', 'idUsuario'],
        });

      if (verificarRegistro) {
        return new GenericResponse(
          '401',
          'Ya estas afiliado a esta empresa',
          [],
        );
      }

      const haySolicitud = await this.RegistroAfiliacionesRepository.findOne({
        where: {
          idEmpresa: empresaInformacion,
          idUsuario: usuario,
          estado: 'PEN',
        },
        relations: ['idEmpresa', 'idUsuario'],
      });

      if (haySolicitud) {
        return new GenericResponse(
          '403',
          'Ya has enviado solicitud a esta empresa debes esperar asta que la empresa la acepte',
          [],
        );
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

      const usuarios = await this.UsuariosRepository.createQueryBuilder(
        'usuario',
      )
        .innerJoinAndSelect('usuario.areaSucursal', 'areaSucursal')
        .innerJoinAndSelect('areaSucursal.idSucursal', 'sucursal')
        .innerJoinAndSelect('sucursal.idEmpresa', 'empresa')
        .where('empresa.id = :idEmpresa', {
          idEmpresa: createRegistroAfiliacioneDto.idEmpresa,
        })
        .andWhere('usuario.estado = :estado', { estado: 2 })
        .getMany();

      const dispositivos = await this.DispositivosRepository.createQueryBuilder(
        'dispositivo',
      )
        .innerJoinAndSelect('dispositivo.idusuario', 'usuario') // Unimos con la tabla de usuarios
        .where('usuario.id IN (:...usuarioIds)', {
          usuarioIds: usuarios.map((usuario) => usuario.id),
        })
        .distinct(true) // Asegura que los resultados sean únicos
        .getMany();

      const tokensDispositivos: string[] = dispositivos.map(
        (dispositivo) => dispositivo.tokendispositivo,
      );

      const createNotificacioneDto: CreateNotificacioneDto = {
        tokens: tokensDispositivos,
        payload: {
          notification: {
            title: 'Solicitud Afiliacion',
            body: `Usuario ${usuario.nombres } ${usuario.apellidos} ha enviado una solicitud de afiliacion`,
          },
          data: {
            customDataKey: 'customDataValue',
          },
        },
      };

      const result = await this.notificacionesService.sendNotification(createNotificacioneDto);

      await this.RegistroAfiliacionesRepository.save(RegistroAfiliaciones);

      return new GenericResponse('200', `EXITO`, result);
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

      if (!usuario)
        return new GenericResponse(
          '400',
          `usuario con id ${updateRegistroAfiliacioneDto.idUsuario} no encontrado`,
          [],
        );

      const empresaInformacion = await this.empresaRepository.findOneBy({
        id: updateRegistroAfiliacioneDto.idEmpresa,
      });

      if (!empresaInformacion)
        return new GenericResponse(
          '400',
          `Empresa con id ${updateRegistroAfiliacioneDto.idEmpresa} no encontrada`,
          [],
        );

      const RegistroAfiliacion =
        await this.RegistroAfiliacionesRepository.findOneBy({ id });

      if (!RegistroAfiliacion)
        return new GenericResponse(
          '400',
          `RegistroAfiliacion con id ${id} no encontrado`,
          [],
        );

      const updateRegistroAfiliacion =
        this.RegistroAfiliacionesRepository.merge(RegistroAfiliacion, {
          idEmpresa: empresaInformacion,
          idUsuario: usuario,
          fechaInicio: new Date(),
          estado: updateRegistroAfiliacioneDto.estado,
        });

      await this.RegistroAfiliacionesRepository.save(updateRegistroAfiliacion);

      return new GenericResponse('200', `EXITO`, updateRegistroAfiliacion);
    } catch (error) {
      return new GenericResponse('500', `Error al crear `, error);
    }
  }

  async verificarAfiliacion(
    createRegistroAfiliacioneDto: CreateRegistroAfiliacioneDto,
  ) {
    try {
      const { idEmpresa, idUsuario } = createRegistroAfiliacioneDto;

      const empresaInformacion = await this.empresaRepository.findOneBy({
        id: idEmpresa,
      });

      if (!empresaInformacion)
        return new GenericResponse(
          '400',
          `Empresa con id ${createRegistroAfiliacioneDto.idEmpresa} no encontrada`,
          [],
        );

      const usuario = await this.UsuariosRepository.findOneBy({
        id: idUsuario,
      });

      if (!usuario)
        return new GenericResponse(
          '400',
          `usuario con id ${createRegistroAfiliacioneDto.idUsuario} no encontrado`,
          [],
        );

      const registro_afiliacione =
        await this.RegistroAfiliacionesRepository.findOne({
          where: { idEmpresa: empresaInformacion, idUsuario: usuario },
          relations: ['idEmpresa', 'idUsuario'],
        });

      return new GenericResponse('200', `EXITO`, registro_afiliacione);
    } catch (error) {
      return new GenericResponse('500', `Error al crear `, error);
    }
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
    try {
      const whereCondition: any = {};

      if (idEmpresa !== 0) {
        whereCondition.idEmpresa = await this.empresaRepository.findOneBy({
          id: idEmpresa,
        });
      }

      if (estado !== 'TODOS') {
        whereCondition.estado = estado;
      }

      const registroAfiliaciones =
        await this.RegistroAfiliacionesRepository.find({
          where: whereCondition,
          relations: [
            'idEmpresa',
            'idUsuario',
            'idUsuario.registroInformacions',
          ],
        });

      return new GenericResponse('200', `EXITO`, registroAfiliaciones);
    } catch (error) {
      return new GenericResponse('500', `Error al crear `, error);
    }
  }

  async findAllByEmpresa(idEmpresa: number) {
    try {
      const whereCondition: any = { estado: 'ACEP' };

      if (idEmpresa !== 0) {
        whereCondition.idEmpresa = await this.empresaRepository.findOneBy({
          id: idEmpresa,
        });
      }

      const registroAfiliaciones =
        await this.RegistroAfiliacionesRepository.find({
          where: whereCondition,
          relations: [
            'idEmpresa',
            'idUsuario',
            'idUsuario.registroInformacions',
          ],
        });

      return new GenericResponse('200', `EXITO`, registroAfiliaciones);
    } catch (error) {
      return new GenericResponse('500', `Error al crear`, error);
    }
  }

  async afiliacionByUsuario(idUsuario: number) {
    try {
      const usuario = await this.UsuariosRepository.findOneBy({
        id: idUsuario,
      });

      if (!usuario)
        return new GenericResponse(
          '400',
          `El usuario con id ${idUsuario} no existe`,
          [],
        );

      const registroAfiliaciones =
        await this.RegistroAfiliacionesRepository.find({
          where: { idUsuario: usuario, estado: 'ACEP' },
          relations: ['idEmpresa', 'idUsuario'],
        });

      return new GenericResponse('200', `EXITO`, registroAfiliaciones);
    } catch (error) {
      return new GenericResponse('500', `Error al al consultar `, error);
    }
  }

  async remove(id: number) {
    try {
      const RegistroAfiliacion =
        await this.RegistroAfiliacionesRepository.findOneBy({ id });

      if (!RegistroAfiliacion)
        return new GenericResponse(
          '400',
          `El RegistroAfiliacion con id ${id} no existe`,
          [],
        );

      RegistroAfiliacion.estado = 'INA';
      await this.RegistroAfiliacionesRepository.save(RegistroAfiliacion);

      return new GenericResponse('200', `EXITO`, RegistroAfiliacion);
    } catch (error) {
      return new GenericResponse('500', `Error al crear `, error);
    }
  }

  async desAfiliar(id: number) {
    try {
      const RegistroAfiliacion =
        await this.RegistroAfiliacionesRepository.findOneBy({ id });

      if (!RegistroAfiliacion)
        return new GenericResponse(
          '400',
          `El RegistroAfiliacion con id ${id} no existe`,
          [],
        );

      RegistroAfiliacion.estado = 'DESA';
      await this.RegistroAfiliacionesRepository.save(RegistroAfiliacion);

      return new GenericResponse('200', `EXITO`, RegistroAfiliacion);
    } catch (error) {
      return new GenericResponse('500', `Error al crear `, error);
    }
  }
}
