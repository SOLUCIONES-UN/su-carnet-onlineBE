import { Injectable } from '@nestjs/common';
import { CreateParticipacionUsuarioDto } from './dto/create-participacion-usuario.dto';
import { UpdateParticipacionUsuarioDto } from './dto/update-participacion-usuario.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { Participaciones } from '../entities/Participaciones';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { EventosEmpresa } from '../entities/EventosEmpresa';
import { FechasEvento } from '../eventos_empresa/dto/fechas_evento';
import { FechasEventos } from '../entities/FechasEventos';
import { AreasEventos } from '../entities/AreasEventos';
import { ResponseFormDto } from './dto/response-form-dto';
import { FormulariosConcursos } from '../entities/FormulariosConcursos';
import { RespuestasUsuariosConcursos } from '../entities/RespuestasUsuariosConcursos';

@Injectable()
export class ParticipacionUsuariosService {
  constructor(
    @InjectRepository(Participaciones)
    private participacionesRepository: Repository<Participaciones>,

    @InjectRepository(RegistroInformacion)
    private registroInformacionRepository: Repository<RegistroInformacion>,

    @InjectRepository(EventosEmpresa)
    private eventosEmpresaRepository: Repository<EventosEmpresa>,

    @InjectRepository(AreasEventos)
    private areasEventosRepository: Repository<AreasEventos>,

    @InjectRepository(FechasEventos)
    private fechasEventosRepository: Repository<FechasEventos>,

    @InjectRepository(FormulariosConcursos)
    private formulariosRepository: Repository<FormulariosConcursos>,

    @InjectRepository(RespuestasUsuariosConcursos)
    private respuestasUsuariosConcursosRepository: Repository<RespuestasUsuariosConcursos>,
  ) {}

  async create(createParticipacionUsuarioDto: CreateParticipacionUsuarioDto) {
    try {
      const { areaInscrito, fechaParticipacion, idEvento, idUsuario } =
        createParticipacionUsuarioDto;

      const { usuario, evento, area, fechaParticipa } =
        await this.getModelsParticipacion(
          idUsuario,
          idEvento,
          areaInscrito,
          fechaParticipacion,
        );

      const userRegisterd = await this.isUserRegistered(
        usuario,
        evento,
        fechaParticipa,
      );

      if (userRegisterd) {
        return new GenericResponse(
          '400',
          `El usuario ya se encuentra registrado en el evento`,
          [],
        );
      }

      const userCanParticipate = await this.canParticipate(
        fechaParticipa,
        evento,
        area,
      );

      if (!userCanParticipate) {
        return new GenericResponse(
          '400',
          `No hay cupo en el area ${area.nombreArea} para la fecha ${fechaParticipa.fechaInicio}`,
          [],
        );
      }

      const participacion = this.participacionesRepository.create({
        areaInscrito: area,
        fechaParticipacion: fechaParticipa,
        idEvento: evento,
        idUsuario: usuario,
      });

      await this.participacionesRepository.save(participacion);

      return new GenericResponse(
        '200',
        'Participacion de usuario creada con exito',
        participacion,
      );
    } catch (error) {
      console.log(error);
      return new GenericResponse(
        '500',
        'Error al crear la participacion de usuario',
        error,
      );
    }
  }

  async findAllByEvento(idEvento: number) {
    try {
      const evento = await this.eventosEmpresaRepository.findOne({
        where: { idEvento, estado: 1 },
      });

      const participaciones = this.participacionesRepository.find({
        where: { idEvento: evento },
        relations: [
          'areaInscrito',
          'fechaParticipacion',
          'idUsuario',
          'idEvento',
        ],
      });

      return new GenericResponse(
        '200',
        'Participaciones obtenidas con exito',
        participaciones,
      );
    } catch (error) {
      return new GenericResponse(
        '500',
        'Error al obtener las participaciones',
        error,
      );
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} participacionUsuario`;
  }

  async update(
    idParticipacion: number,
    updateParticipacionUsuarioDto: UpdateParticipacionUsuarioDto,
  ) {
    try {
      const { areaInscrito, fechaParticipacion, idEvento, idUsuario } =
        updateParticipacionUsuarioDto;

      const { usuario, evento, area, fechaParticipa } =
        await this.getModelsParticipacion(
          idUsuario,
          idEvento,
          areaInscrito,
          fechaParticipacion,
        );

      const participacionFinnd = await this.participacionesRepository.findOneBy(
        {
          idParticipacion,
        },
      );

      if (!participacionFinnd) {
        return new GenericResponse(
          '400',
          `Participacion con id ${idParticipacion} no encontrada`,
          [],
        );
      }

      const participacion = await this.participacionesRepository.update(
        {
          idParticipacion,
        },
        {
          areaInscrito: area,
          fechaParticipacion: fechaParticipa,
          idEvento: evento,
          idUsuario: usuario,
        },
      );

      return new GenericResponse(
        '200',
        'Participacion de usuario actualizada con exito',
        participacion,
      );
    } catch (error) {
      return new GenericResponse(
        '500',
        'Error al actualizar la participacion',
        error,
      );
    }
  }

  async remove(id: number) {
    try {
      const participacion = await this.participacionesRepository.findOneBy({
        idParticipacion: id,
      });

      if (!participacion) {
        return new GenericResponse(
          '400',
          `Participacion con id ${id} no encontrada`,
          [],
        );
      }

      this.participacionesRepository.update(
        { idParticipacion: id },
        {
          estado: 0,
        },
      );

      return new GenericResponse(
        '200',
        'Participacion eliminada con exito',
        participacion,
      );
    } catch (error) {
      return new GenericResponse('500', `Error `, error);
    }
  }

  async responseForm(responseFormDTO: ResponseFormDto) {
    try {
      const { respuestas } = responseFormDTO;

      for (const respuestaArray of respuestas) {
        const { idFormulario, idUsuario, respuesta } = respuestaArray;

        const usuario = await this.registroInformacionRepository.findOne({
          where: { id: idUsuario },
        });

        if (!usuario) {
          return new GenericResponse(
            '400',
            `Usuario con id ${idUsuario} no encontrado`,
            [],
          );
        }

        const participacion = await this.participacionesRepository.findOne({
          where: { idUsuario: usuario },
        });

        if (!participacion) {
          return new GenericResponse(
            '400',
            `El usuario no se encuentra registrado en ningun evento`,
            [],
          );
        }
        const formulario = await this.formulariosRepository.findOne({
          where: { idFormulario },
        });

        if (!formulario) {
          return new GenericResponse(
            '400',
            `Formulario con id ${idFormulario} no encontrado`,
            [],
          );
        }

        const respuestaUsuario =
          this.respuestasUsuariosConcursosRepository.create({
            idFormulario: formulario,
            idUsuario: usuario,
            respuesta,
          });

        await this.respuestasUsuariosConcursosRepository.save(respuestaUsuario);
      }

      return new GenericResponse('200', 'Respuestas creadas con exito', []);
    } catch (error) {
      return new GenericResponse('500', `Error `, error);
    }
  }

  async canParticipate(
    fechaParticipacion: FechasEventos,
    evento: EventosEmpresa,
    area: AreasEventos,
  ) {
    const [_, participacionesAreas] = await this.participacionesRepository
      .createQueryBuilder('participacion')
      .where('participacion.fechaParticipacion = :fechaId', {
        fechaId: fechaParticipacion.idFecha,
      })
      .andWhere('participacion.idEvento = :eventoId', {
        eventoId: evento.idEvento,
      })
      .andWhere('participacion.areaInscrito = :areaId', { areaId: area.idArea })
      .andWhere('participacion.estado = :estado', { estado: 1 })
      .getManyAndCount();

    if (participacionesAreas === area.cupoMaximo) {
      return false;
    }

    return true;
  }

  async isUserRegistered(
    usuario: RegistroInformacion,
    evento: EventosEmpresa,
    fechaParticipacion: FechasEventos,
  ) {
    const usuarioParticipando = await this.participacionesRepository
      .createQueryBuilder('userParticipando')
      .where('userParticipando.idUsuario = :usuarioId', {
        usuarioId: usuario.id,
      })
      .andWhere('userParticipando.idEvento = :eventoId', {
        eventoId: evento.idEvento,
      })
      .andWhere('userParticipando.fechaParticipacion = :fechaId', {
        fechaId: fechaParticipacion.idFecha,
      })
      .andWhere('userParticipando.estado = :estado', { estado: 1 })
      .getOne();

    if (usuarioParticipando) {
      return true;
    }

    return false;
  }

  async getModelsParticipacion(
    idUsuario: number,
    idEvento: number,
    areaInscrito: number,
    fechaParticipacion: number,
  ) {
    const [usuario, evento, area, fechaParticipa] = await Promise.all([
      this.registroInformacionRepository.findOne({
        where: { id: idUsuario, estado: 'ACT' },
      }),
      this.eventosEmpresaRepository.findOne({ where: { idEvento, estado: 1 } }),
      this.areasEventosRepository.findOne({
        where: { idArea: areaInscrito, estado: 1 },
      }),
      this.fechasEventosRepository.findOne({
        where: { idFecha: fechaParticipacion },
      }),
    ]);

    if (!usuario) {
      throw `Usuario con id ${idUsuario} no encontrado`;
    }

    if (!evento) {
      throw `Evento con id ${idEvento} no encontrado`;
    }

    if (!area) {
      throw `Área con id ${areaInscrito} no encontrada`;
    }

    if (!fechaParticipa) {
      throw `Fecha de participación con id ${fechaParticipacion} no encontrada`;
    }

    return {
      usuario,
      evento,
      area,
      fechaParticipa,
    };
  }
}
