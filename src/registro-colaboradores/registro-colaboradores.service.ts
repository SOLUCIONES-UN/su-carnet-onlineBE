import { Injectable } from '@nestjs/common';
import { CreateRegistroColaboradoreDto } from './dto/create-registro-colaboradore.dto';
import { UpdateRegistroColaboradoreDto } from './dto/update-registro-colaboradore.dto';
import { RegistroColaboradores } from '../entities/RegistroColaboradores';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { Usuarios } from '../entities/Usuarios';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { Dispositivos } from '../entities/Dispositivos';
import { CreateNotificacioneDto } from '../notificaciones/dto/create-notificacione.dto';
import { NotificacionesService } from '../notificaciones/notificaciones.service';

@Injectable()
export class RegistroColaboradoresService {

  constructor(
    @InjectRepository(RegistroColaboradores)
    private RegistroColaboradoresRepository: Repository<RegistroColaboradores>,

    @InjectRepository(EmpresasInformacion)
    private empresaRepository: Repository<EmpresasInformacion>,

    @InjectRepository(Usuarios)
    private UsuariosRepository: Repository<Usuarios>,

    @InjectRepository(Dispositivos)
    private DispositivosRepository: Repository<Dispositivos>,

    private readonly notificacionesService: NotificacionesService,
  ) { }

  async create(createRegistroColaboradoreDto: CreateRegistroColaboradoreDto) {

    try {

      const usuario = await this.UsuariosRepository.findOneBy({ id: createRegistroColaboradoreDto.idUsuario });

      if (!usuario) return new GenericResponse('400', `No se encontro el usuario con id ${createRegistroColaboradoreDto.idUsuario}`, null);

      const empresaInformacion = await this.empresaRepository.findOneBy({ id: createRegistroColaboradoreDto.idEmpresa });

      if (!empresaInformacion) return new GenericResponse('400', `No se encontro la empresa con id ${createRegistroColaboradoreDto.idEmpresa}`, null);


      const haySolicitud = await this.RegistroColaboradoresRepository.findOne({
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

      if (createRegistroColaboradoreDto.estado === 'PEN') {
        fechaInicioAfiliacion = null;
      } else if (createRegistroColaboradoreDto.estado != 'PEN') {
        fechaInicioAfiliacion = new Date();
      }

      const RegistroColaboradores = this.RegistroColaboradoresRepository.create({
        idEmpresa: empresaInformacion,
        idUsuario: usuario,
        fechaSolicitud: new Date(),
        fechaInicio: fechaInicioAfiliacion,
        estado: createRegistroColaboradoreDto.estado,
      });

      const usuarios = await this.UsuariosRepository.createQueryBuilder(
        'usuario',
      )
        .innerJoinAndSelect('usuario.areaSucursal', 'areaSucursal')
        .innerJoinAndSelect('areaSucursal.idSucursal', 'sucursal')
        .innerJoinAndSelect('sucursal.idEmpresa', 'empresa')
        .where('empresa.id = :idEmpresa', {
          idEmpresa: createRegistroColaboradoreDto.idEmpresa,
        })
        .andWhere('usuario.estado = :estado', { estado: 2 })
        .getMany();

      if (usuarios.length === 0) {

        await this.RegistroColaboradoresRepository.save(RegistroColaboradores);
        return new GenericResponse('200', `EXITO`, RegistroColaboradores);
      }

      const dispositivos = await this.DispositivosRepository.createQueryBuilder(
        'dispositivo',
      )
        .innerJoinAndSelect('dispositivo.idusuario', 'usuario')
        .where('usuario.id IN (:...usuarioIds)', {
          usuarioIds: usuarios.map((usuario) => usuario.id),
        })
        .distinct(true)
        .getMany();

      const tokensDispositivos: string[] = dispositivos.map(
        (dispositivo) => dispositivo.tokendispositivo,
      );

      const createNotificacioneDto: CreateNotificacioneDto = {
        tokens: tokensDispositivos,
        payload: {
          notification: {
            title: 'Solicitud Colaboracion',
            body: `${usuario.nombres} ${usuario.apellidos} ha enviado una solicitud de colaboracion Por favor, revisa los detalles para proceder con la aprobación.`,
          },
          data: {
            dispatch: "verificar_colaboracion",
            customDataKey: 'customDataValue',
          },
        },
      };

      const result = await this.notificacionesService.sendNotification(createNotificacioneDto);
      await this.notificacionesService.saveNotification(createNotificacioneDto, usuario.id);

      await this.RegistroColaboradoresRepository.save(RegistroColaboradores);

      return new GenericResponse('200', `EXITO`, result);

    } catch (error) {
      return new GenericResponse('500', `Error al enviar solicitud`, error);
    }
  }

  async findAll(idEmpresa: number, estado: string) {
    const whereCondition: any = {};

    if (idEmpresa !== 0) {
      whereCondition.idEmpresa = await this.empresaRepository.findOneBy({ id: idEmpresa });
    }

    if (estado !== 'TODOS') {
      whereCondition.estado = estado;
    }

    const RegistroColaboradores = await this.RegistroColaboradoresRepository.find(
      {
        where: whereCondition,
        relations: ['idEmpresa', 'idUsuario'],
      },
    );

    return new GenericResponse('200', `EXITO`, RegistroColaboradores);
  }

  async solicitudesUsuario(idUsuario: number) {

    try {

      const usuario = await this.UsuariosRepository.findOneBy({ id: idUsuario });

      if (!usuario) return new GenericResponse('400', `Usuario con id $${idUsuario} no existe `, null);

      const solicitudes = await this.RegistroColaboradoresRepository.find({
        where: { idUsuario: usuario },
        relations: ['idEmpresa', 'idUsuario'],
      })

      return new GenericResponse('200', `EXITO`, solicitudes);

    } catch (error) {
      return new GenericResponse('200', `EXITO`, error);
    }
  }


  async update(id: number, updateRegistroColaboradoreDto: UpdateRegistroColaboradoreDto) {

    try {
      const usuario = await this.UsuariosRepository.findOneBy({ id: updateRegistroColaboradoreDto.idUsuario });

      if (!usuario) return new GenericResponse('400', `No se encontro el usuario con id ${updateRegistroColaboradoreDto.idUsuario}`, null);

      const empresaInformacion = await this.empresaRepository.findOneBy({
        id: updateRegistroColaboradoreDto.idEmpresa,
      });

      if (!empresaInformacion) return new GenericResponse('400', `No se encontro la empresa con id ${updateRegistroColaboradoreDto.idEmpresa}`, null);

      const RegistroColaboradores = await this.RegistroColaboradoresRepository.findOneBy({ id });

      if (!RegistroColaboradores) return new GenericResponse('400', `No se encontro RegistroColaboradores con id ${id}`, null);

      const updateRegistroColaboradores = this.RegistroColaboradoresRepository.merge(RegistroColaboradores, {
        idEmpresa: empresaInformacion,
        idUsuario: usuario,
        fechaInicio: new Date(),
        estado: updateRegistroColaboradoreDto.estado,
      });

      const dispositivos = await this.DispositivosRepository.find({
        where: { idusuario: usuario }
      })

      const tokensDispositivos: string[] = dispositivos.map(
        (dispositivo) => dispositivo.tokendispositivo,
      );

      if (updateRegistroColaboradoreDto.estado == 'ACEP') {
        const createNotificacioneDto: CreateNotificacioneDto = {
          tokens: tokensDispositivos,
          payload: {
            notification: {
              title: 'Solicitud colaboracion',
              body: `La empresa ${empresaInformacion.nombre} ha aceptado tu solicitud de colaboracion `,
            },
            data: {
              dispatch: "colaboracion_aceptada",
              customDataKey: 'customDataValue',
            },
          },
        };

        await this.notificacionesService.sendNotification(createNotificacioneDto);
        await this.notificacionesService.saveNotification(createNotificacioneDto, usuario.id);

      } else if (updateRegistroColaboradoreDto.estado == 'RECH') {
        const createNotificacioneDto: CreateNotificacioneDto = {
          tokens: tokensDispositivos,
          payload: {
            notification: {
              title: 'Solicitud colaboracion',
              body: `La empresa ${empresaInformacion.nombre} ha rechazado tu solicitud de colaboracion `,
            },
            data: {
              dispatch: "colaboracion_rechazada",
              customDataKey: 'customDataValue',
            },
          },
        };

        await this.notificacionesService.sendNotification(createNotificacioneDto);
        await this.notificacionesService.saveNotification(createNotificacioneDto, usuario.id);
      }

      await this.RegistroColaboradoresRepository.save(updateRegistroColaboradores);

      return new GenericResponse('200', `EXITO`, updateRegistroColaboradores);

    } catch (error) {
      return new GenericResponse('500', `Error al editar`, error);
    }

  }

  async remove(id: number) {

    try {
      const RegistroColaboradores = await this.RegistroColaboradoresRepository.findOneBy({ id });

      if (!RegistroColaboradores) return new GenericResponse('400', `No se encontro RegistroColaboradores con id ${id}`, null);

      RegistroColaboradores.estado = 'INA';
      return await this.RegistroColaboradoresRepository.save(RegistroColaboradores);

    } catch (error) {
      return new GenericResponse('500', `Error el eliminar`, error);
    }
  }
}
