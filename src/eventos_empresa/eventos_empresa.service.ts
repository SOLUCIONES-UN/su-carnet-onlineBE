import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateEventosEmpresaDto,
  preguntasConcurso,
} from './dto/create-eventos_empresa.dto';
import { UpdateEventosEmpresaDto } from './dto/update-eventos_empresa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Not, Repository } from 'typeorm';
import { EventosEmpresa } from '../entities/EventosEmpresa';
import { FechasEventos } from '../entities/FechasEventos';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { Usuarios } from '../entities/Usuarios';
import { Dispositivos } from '../entities/Dispositivos';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { RegistroAfiliaciones } from '../entities/RegistroAfiliaciones';
import { CreateNotificacioneDto } from '../notificaciones/dto/create-notificacione.dto';
import { Notificaciones } from '../entities/Notificaciones';
import { TipoDocumentos } from '../entities/TipoDocumentos';
import { ArchivosEventos } from '../entities/ArchivosEventos';
import { AreasEventos } from '../entities/AreasEventos';
import { FormulariosConcursos } from '../entities/FormulariosConcursos';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { Console } from 'console';
import { Participaciones } from '../entities/Participaciones';

@Injectable()
export class EventosEmpresaService {
  constructor(
    @InjectRepository(EventosEmpresa)
    private readonly eventosEmpresaRepository: Repository<EventosEmpresa>,

    @InjectRepository(FechasEventos)
    private readonly fechasEventosRepository: Repository<FechasEventos>,

    @InjectRepository(EmpresasInformacion)
    private readonly empresasRepository: Repository<EmpresasInformacion>,

    @InjectRepository(Dispositivos)
    private DispositivosRepository: Repository<Dispositivos>,

    private readonly notificacionesService: NotificacionesService,

    @InjectRepository(RegistroAfiliaciones)
    private registroAfiliacionesRepository: Repository<RegistroAfiliaciones>,

    @InjectRepository(Notificaciones)
    private NotificacionesRepository: Repository<Notificaciones>,

    @InjectRepository(TipoDocumentos)
    private tiposDocumentosRepository: Repository<TipoDocumentos>,

    @InjectRepository(ArchivosEventos)
    private archivosEventosRepository: Repository<ArchivosEventos>,

    @InjectRepository(AreasEventos)
    private areasEventosRepository: Repository<AreasEventos>,

    @InjectRepository(RegistroInformacion)
    private UsuariosRepository: Repository<RegistroInformacion>,

    @InjectRepository(FormulariosConcursos)
    private formularioRepository: Repository<FormulariosConcursos>,

    @InjectRepository(Participaciones)
    private participacionesRepository: Repository<Participaciones>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createEventosEmpresaDto: CreateEventosEmpresaDto) {
    let eventosEmpresa: EventosEmpresa;
    try {
      const {
        fechas_evento,
        idEmpresa,
        archivosEvento,
        AreasEventos,
        preguntas_concurso,
        creado_por,
        ...eventosData
      } = createEventosEmpresaDto;

      const FechaActual = new Date();

      const usuario = await this.UsuariosRepository.findOneBy({
        id: creado_por,
      });

      if (!usuario) {
        return new GenericResponse(
          '400',
          `Usuario que creo el evento no encontrado`,
          [],
        );
      }

      const empresaFound = await this.empresasRepository.findOneBy({
        id: idEmpresa,
      });

      if (!empresaFound) {
        return new GenericResponse(
          '400',
          `Empresa con id ${idEmpresa} no encontrada `,
          [],
        );
      }

      let areasEventos: AreasEventos[] = [];
      if (AreasEventos && AreasEventos.length > 0) {
        areasEventos = await this.getAreasEventos(AreasEventos);
      }

      eventosEmpresa = this.eventosEmpresaRepository.create({
        ...eventosData,
        idEmpresa: empresaFound,
        creadoPor: usuario,
        estado: 1,
      });

      eventosEmpresa.areasEventos = areasEventos;

      await this.eventosEmpresaRepository.save(eventosEmpresa);

      if (archivosEvento && archivosEvento.length > 0) {
        await this.CreateArchivosEventos(archivosEvento, eventosEmpresa);
      }

      if (preguntas_concurso && preguntas_concurso.length > 0) {
        await this.createFormulariosConcurso(
          preguntas_concurso,
          eventosEmpresa,
        );
      }

      const fechasEventos = fechas_evento.map((fecha) => {
        return this.fechasEventosRepository.create({
          idEvento: eventosEmpresa,
          fechaInicio: fecha.fecha_inicio,
          fechaFin: fecha.fecha_fin,
        });
      });

      await this.fechasEventosRepository.save(fechasEventos);

      const tipoEvento =
        eventosEmpresa.tipoEvento === 1 ? 'Evento' : 'Concurso';

      if (eventosEmpresa.fechaPublicacion === FechaActual) {
        this.notifyNewEvents(eventosEmpresa, empresaFound, tipoEvento);
      }

      return new GenericResponse('200', `EXITO`, eventosEmpresa);
    } catch (error) {
      if (eventosEmpresa) {
        await this.eventosEmpresaRepository.delete(eventosEmpresa.idEvento);
      }

      return new GenericResponse('500', `Error: `, error.message);
    }
  }

  async findAll() {
    try {
      const eventosEmpresa = await this.eventosEmpresaRepository.find({
        relations: ['idEmpresa', 'fechasEventos'],
      });

      return new GenericResponse('200', `EXITO`, eventosEmpresa);
    } catch (error) {
      return new GenericResponse('500', `Error: `, error);
    }
  }

  async findAllByEmpresa(idEmpresa: number) {
    try {
      const empresa = await this.empresasRepository.findOneBy({
        id: idEmpresa,
      });

      if (!empresa)
        return new GenericResponse('400', `Empresa no encontrada`, []);

      const eventosEmpresa = await this.eventosEmpresaRepository.find({
        where: { idEmpresa: empresa, estado: 1 },
        relations: {
          idEmpresa: true,
          fechasEventos: true,
          areasEventos: true,
          formulariosConcursos: true,
          archivosEventos: {
            idDocumento: true,
          },
        },
      });

      eventosEmpresa.map((evento) => {
        evento.formulariosConcursos.map((pregunta) => {
          delete pregunta.respuesta;
        });
      });

      const eventsWithAreasCapacity = await Promise.all(
        eventosEmpresa.map(async (evento) => {
          const fechas_aventos = await Promise.all(
            evento.fechasEventos.map(async (fecha) => {
              const areas = await Promise.all(
                evento.areasEventos.map(async (area) => {
                  const capacityAvailable =
                    await this.calculateCapacityOfEvents(area, fecha);

                  return {
                    nombreArea: area.nombreArea,
                    cupoMaximo: area.cupoMaximo,
                    disponibilidad: area.cupoMaximo - capacityAvailable,
                  };
                }),
              );

              return {
                ...fecha,
                areas,
              };
            }),
          );

          return {
            ...evento,
            fechasEventos: fechas_aventos,
          };
        }),
      );

      return new GenericResponse('200', `EXITO`, eventsWithAreasCapacity);
    } catch (error) {
      console.log('Error', error);
      return new GenericResponse('500', `Error: `, error);
    }
  }

  async obtenerRespuestasEvento(idEvento: number) {
    try {
      const evento = await this.eventosEmpresaRepository.findOne({
        relations: {
          formulariosConcursos: {
            respuestasUsuariosConcursos: {
              idUsuario: true,
            },
          },
        },
        where: { idEvento: idEvento },
      });

      if (!evento) {
        return new GenericResponse(
          '400',
          `Evento con id ${idEvento} no encontrado `,
          [],
        );
      }

      return new GenericResponse('200', `EXITO`, evento);
    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async update(id: number, updateEventosEmpresaDto: UpdateEventosEmpresaDto) {
    try {
      const {
        fechas_evento,
        idEmpresa,
        archivosEvento,
        AreasEventos,
        preguntas_concurso,
        ...eventosData
      } = updateEventosEmpresaDto;

      const queryRunner = await this.dataSource.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const empresaFound = await this.empresasRepository.findOneBy({
          id: idEmpresa,
        });

        if (!empresaFound) {
          return new GenericResponse(
            '400',
            `Empresa con id ${idEmpresa} no encontrada `,
            [],
          );
        }

        const eventoEmpresa = await this.eventosEmpresaRepository.preload({
          idEvento: id,
          idEmpresa: empresaFound,
          ...eventosData,
        });

        if (fechas_evento && fechas_evento.length > 0) {
          await queryRunner.manager.delete(FechasEventos, {
            idEvento: eventoEmpresa,
          });

          console.log('fechas_evento', fechas_evento);

          const fechasEventos = fechas_evento.map((fecha) => {
            return this.fechasEventosRepository.create({
              idEvento: eventoEmpresa,
              fechaInicio: fecha.fecha_inicio,
              fechaFin: fecha.fecha_fin,
            });
          });

          await this.fechasEventosRepository.save(fechasEventos);
        }

        if (archivosEvento && archivosEvento.length > 0) {
          await queryRunner.manager.delete(ArchivosEventos, {
            idEvento: eventoEmpresa,
          });

          await this.CreateArchivosEventos(archivosEvento, eventoEmpresa);
        }

        if (preguntas_concurso) {
          await queryRunner.manager.delete(FormulariosConcursos, {
            idEvento: eventoEmpresa,
          });

          await this.createFormulariosConcurso(
            preguntas_concurso,
            eventoEmpresa,
          );
        }

        if (AreasEventos && AreasEventos.length > 0) {
          const newAreasEventos = await this.getAreasEventos(AreasEventos);
          eventoEmpresa.areasEventos = newAreasEventos;
        }

        await queryRunner.manager.save(eventoEmpresa);

        await queryRunner.commitTransaction();
        await queryRunner.release();

        return new GenericResponse('200', `EXITO`, eventoEmpresa);
      } catch (error) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
        return new GenericResponse('500', `Error`, error);
      }
    } catch (error) {
      console.log('Error', error);
      return new GenericResponse('500', `Error`, error);
    }
  }

  async remove(id: number) {
    try {
      const eventoEmpresa = await this.eventosEmpresaRepository.findOneBy({
        idEvento: id,
      });

      if (!eventoEmpresa) {
        return new GenericResponse(
          '400',
          `Evento con id ${id} no encontrado `,
          [],
        );
      }

      eventoEmpresa.estado = 0;
      return this.eventosEmpresaRepository.save(eventoEmpresa);
    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async CreateArchivosEventos(
    archivosEventos: number[],
    eventoEmpresa: EventosEmpresa,
  ) {
    const documentoEventoToInsert: {
      idEvento: EventosEmpresa;
      idDocumento: TipoDocumentos;
    }[] = [];

    const documentosEnviados = await this.tiposDocumentosRepository.find({
      where: { id: In(archivosEventos), estado: 1 },
    });

    const idEncontrados = documentosEnviados.map((documento) => documento.id);

    const idNoEncontrados = archivosEventos.filter(
      (documento) => !idEncontrados.includes(documento),
    );

    if (idNoEncontrados.length > 0) {
      throw new NotFoundException(
        `Tipo de documento con id ${idNoEncontrados} no encontrado o inactivo`,
      );
    }

    documentosEnviados.map(async (documento) => {
      documentoEventoToInsert.push({
        idEvento: eventoEmpresa,
        idDocumento: documento,
      });
    });

    await this.archivosEventosRepository.insert(documentoEventoToInsert);
  }

  async getAreasEventos(areasEventos: number[]) {
    const areasEnviadas = await this.areasEventosRepository.find({
      where: { idArea: In(areasEventos) },
    });

    const idEncontrados = areasEnviadas.map((area) => area.idArea);

    const idNoEncontrados = areasEventos.filter(
      (area) => !idEncontrados.includes(area),
    );

    if (idNoEncontrados.length > 0) {
      throw new NotFoundException(
        `Areas de evento con id ${idNoEncontrados} no encontrados`,
      );
    }

    return areasEnviadas;
  }

  async createFormulariosConcurso(
    preguntas_concurso: preguntasConcurso[],
    eventoEmpresa: EventosEmpresa,
  ) {
    const preguntasConcursoToInsert: {
      idEvento: EventosEmpresa;
      pregunta: string;
      respuesta: string;
    }[] = [];

    preguntas_concurso.map(async (pregunta) => {
      preguntasConcursoToInsert.push({
        idEvento: eventoEmpresa,
        pregunta: pregunta.pregunta,
        respuesta: pregunta.respuesta,
      });
    });

    await this.formularioRepository.insert(preguntasConcursoToInsert);
  }

  async notifyNewEvents(
    evento: EventosEmpresa,
    empresa: EmpresasInformacion,
    type_event: string,
  ) {
    try {
      //Obtenemos todos los usuarios afiliados a la empresa
      const usuariosAfiliados = await this.registroAfiliacionesRepository.find({
        where: { idEmpresa: empresa, estado: 'ACEPT' },
        relations: ['idUsuario'],
      });

      //validar que existan usuarios
      if (usuariosAfiliados.length > 0) {
        const titleNotificacion = `Nuevo ${type_event}`;
        const bodyNotificacion = `Nuevo ${type_event}: ${evento.titulo} en ${empresa.nombre} no olvides marcar tu participacion`;

        //obtener los dispositivos de los usuarios
        const dispositivosUsuarios = await this.DispositivosRepository.find({
          where: {
            idusuario: In(
              usuariosAfiliados.map((usuario) => usuario.idUsuario),
            ),
          },
        });

        //creamos un arreglo de los tokens de los dispositivos

        const tokens = dispositivosUsuarios.map(
          (dispositivo) => dispositivo.tokendispositivo,
        );

        const createNotificacioneDto: CreateNotificacioneDto = {
          tokens: tokens,
          payload: {
            notification: {
              title: titleNotificacion,
              body: bodyNotificacion,
            },
            data: {
              dispatch: 'new_event',
              customDataKey: 'customDataValue',
            },
          },
        };

        const notificacionesEnviadasToInsert: {
          createNotificacioneDto: CreateNotificacioneDto;
          idUsuario: number;
        }[] = [];

        const result = await this.notificacionesService.sendNotification(
          createNotificacioneDto,
        );

        //TODO: insertar los usuarios a los que se les ha enviado una notifiacion de nuevo evento en la base de datos
        // usuariosAfiliados.map(async (usuario) => {
        //   notificacionesEnviadasToInsert.push({
        //     createNotificacioneDto,
        //     idUsuario: usuario.idUsuario.id,
        //   });
        // });
      }
    } catch (error) {}
  }

  async calculateCapacityOfEvents(area: AreasEventos, fecha: FechasEventos) {
    const countParticipations =
      await this.participacionesRepository.findAndCountBy({
        areaInscrito: area,
        estado: 1,
        fechaParticipacion: fecha,
      });

    return countParticipations[1];
  }
}
