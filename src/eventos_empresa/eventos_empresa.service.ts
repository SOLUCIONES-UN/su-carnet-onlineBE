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

@Injectable()
export class EventosEmpresaService {
  constructor(
    @InjectRepository(EventosEmpresa)
    private readonly eventosEmpresaRepository: Repository<EventosEmpresa>,

    @InjectRepository(FechasEventos)
    private readonly fechasEventosRepository: Repository<FechasEventos>,

    @InjectRepository(EmpresasInformacion)
    private readonly empresasRepository: Repository<EmpresasInformacion>,

    @InjectRepository(Usuarios)
    private UsuariosRepository: Repository<Usuarios>,

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

    private readonly dataSource: DataSource,
  ) {}

  async create(createEventosEmpresaDto: CreateEventosEmpresaDto) {
    try {
      const {
        fechas_evento,
        idEmpresa,
        archivosEvento,
        AreasEventos,
        preguntas_concurso,
        ...eventosData
      } = createEventosEmpresaDto;

      const FechaActual = new Date();

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
      if (AreasEventos.length > 0) {
        areasEventos = await this.getAreasEventos(AreasEventos);
      }

      const eventosEmpresa = this.eventosEmpresaRepository.create({
        ...eventosData,
        idEmpresa: empresaFound,
      });

      eventosEmpresa.areasEventos = areasEventos;

      await this.eventosEmpresaRepository.save(eventosEmpresa);

      const fechasEventos = fechas_evento.map((fecha) => {
        return this.fechasEventosRepository.create({
          idEvento: eventosEmpresa,
          fechaInicio: fecha.fecha_inicio,
          fechaFin: fecha.fecha_fin,
        });
      });

      await this.fechasEventosRepository.save(fechasEventos);

      if (archivosEvento.length > 0) {
        await this.CreateArchivosEventos(archivosEvento, eventosEmpresa);
      }

      if (preguntas_concurso.length > 0) {
        await this.createFormulariosConcurso(
          preguntas_concurso,
          eventosEmpresa,
        );
      }

      const tipoEvento =
        eventosEmpresa.tipoEvento === 1 ? 'Evento' : 'Concurso';

      if (eventosEmpresa.fechaPublicacion === FechaActual) {
        this.notifyNewEvents(eventosEmpresa, empresaFound, tipoEvento);
      }

      return new GenericResponse('200', `EXITO`, eventosEmpresa);
    } catch (error) {
      return new GenericResponse('500', `Error: `, error);
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

      const envetosEmpresa = await this.eventosEmpresaRepository.find({
        where: { idEmpresa: empresa },
        relations: [
          'idEmpresa',
          'fechasEventos',
          'archivosEvento',
          'areasEventos',
          'FormulariosConcursos',
        ],
      });

      return new GenericResponse('200', `EXITO`, envetosEmpresa);
    } catch (error) {
      return new GenericResponse('500', `Error: `, error);
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

      const queryRunner = await this.dataSource.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        if (fechas_evento) {
          await queryRunner.manager.delete(FechasEventos, {
            idEvento: eventoEmpresa,
          });

          fechas_evento.map((fecha) => {
            return this.fechasEventosRepository.create({
              idEvento: eventoEmpresa,
              fechaInicio: fecha.fecha_inicio,
              fechaFin: fecha.fecha_fin,
            });
          });
        }

        if (archivosEvento) {
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

        if (AreasEventos) {
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
    const documentosEnviados = [];
    const documentoEventoToInsert: {
      idEvento: EventosEmpresa;
      idTipoDocumento: TipoDocumentos;
    }[] = [];

    archivosEventos.map(async (archivo) => {
      const tipoDocumento = await this.tiposDocumentosRepository.findOneBy({
        id: archivo,
      });

      if (!tipoDocumento) {
        throw new NotFoundException(
          `Tipo de documento con id ${archivo} no encontrado`,
        );
      }

      documentosEnviados.push(tipoDocumento);
    });

    documentosEnviados.map(async (documento) => {
      documentoEventoToInsert.push({
        idEvento: eventoEmpresa,
        idTipoDocumento: documento,
      });
    });

    await this.archivosEventosRepository.insert(documentoEventoToInsert);
  }

  async getAreasEventos(areasEventos: number[]) {
    const areasEnviadas = [];

    areasEventos.map(async (area) => {
      const areaEvento = await this.areasEventosRepository.findOneBy({
        idArea: area,
      });

      if (!areaEvento) {
        throw new NotFoundException(
          `Area de evento con id ${area} no encontrado`,
        );
      }

      areasEnviadas.push(areaEvento);
    });

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

    await this.archivosEventosRepository.insert(preguntasConcursoToInsert);
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
}
