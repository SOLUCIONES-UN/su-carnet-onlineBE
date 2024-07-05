import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateRegistroDocumentoDto } from './dto/create-registro_documento.dto';
import { RegistroDocumentos } from '../entities/RegistroDocumentos';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { TipoDocumentos } from '../entities/TipoDocumentos';
import * as bcrypt from 'bcrypt';
import { PaginationDto } from '../common/dtos/pagination.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

import {
  RekognitionClient,
  CompareFacesCommand,
} from '@aws-sdk/client-rekognition';
import { Usuarios } from '../entities/Usuarios';
import { waitForDebugger } from 'inspector';
import { UpdateRegistroDocumentoDto } from './dto/update-registro_documento.dto';

@Injectable()
export class RegistroDocumentosService {
  private readonly logger = new Logger('RegistroDocumentosService');
  private rekognitionClient: RekognitionClient;

  constructor(
    @InjectRepository(RegistroDocumentos)
    private RegistroDocumentosRepository: Repository<RegistroDocumentos>,

    @InjectRepository(RegistroInformacion)
    private RegistroInformacionRepository: Repository<RegistroInformacion>,

    @InjectRepository(TipoDocumentos)
    private TipoDocumentosRepository: Repository<TipoDocumentos>,

    @InjectRepository(Usuarios)
    private userRepository: Repository<Usuarios>,
  ) {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const region = process.env.AWS_REGION;

    this.rekognitionClient = new RekognitionClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async getUsuario(user: string): Promise<Usuarios> {
    let usuario: Usuarios;

    if (this.isEmail(user)) {
      // Buscar usuario por email
      usuario = await this.userRepository.findOne({
        where: { email: user, estado: 2 },
      });
    } else if (this.isPhoneNumber(user)) {
      // Buscar usuario por número de teléfono
      usuario = await this.userRepository.findOne({
        where: { telefono: user, estado: 2 },
      });
    }

    return usuario;
  }

  // Método para verificar si el user es un email válido
  private isEmail(user: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(user);
  }

  // Método para verificar si el user es un número de teléfono válido
  private isPhoneNumber(user: string): boolean {
    const phoneRegex = /^[0-9]{10,15}$/; // Ajusta la expresión regular según el formato de número de teléfono que necesites
    return phoneRegex.test(user);
  }

  private readImageFromFile(filePath: string): Buffer {
    const absolutePath = path.resolve(filePath);
    return fs.readFileSync(absolutePath);
  }

  //Funcion para verificar persona por medio de reconocimiento facial
  async compareFaces(foto_dpi: string, fotoPerfil: string): Promise<boolean> {
    const fotoDesencript = Buffer.from(foto_dpi, 'base64').toString('utf8');

    const sourceImageBuffer = this.readImageFromFile(fotoDesencript);
    const targetImageBuffer = this.readImageFromFile(fotoPerfil);

    const params = {
      SourceImage: { Bytes: sourceImageBuffer },
      TargetImage: { Bytes: targetImageBuffer },
      SimilarityThreshold: 90,
    };

    const command = new CompareFacesCommand(params);
    const response = await this.rekognitionClient.send(command);
    return response.FaceMatches.length > 0;
  }

  // Función para transformar la fecha
  transformDate(dateString: string): string {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  }

  async create(createRegistroDocumentoDto: CreateRegistroDocumentoDto) {
    try {
      const { idRegistroInformacion, idTipoDocumento, archivo, ...infoData } =
        createRegistroDocumentoDto;

      const registro_informacion =
        await this.RegistroInformacionRepository.findOneBy({
          id: idRegistroInformacion,
        });

      if (!registro_informacion) {
        throw new NotFoundException(
          `registro_informacion con ID ${idRegistroInformacion} no encontrada`,
        );
      }

      const TipoDocumentos = await this.TipoDocumentosRepository.findOneBy({
        id: idTipoDocumento,
      });

      if (!TipoDocumentos) {
        throw new NotFoundException(
          `TipoDocumentos con ID ${idTipoDocumento} no encontrada`,
        );
      }

      const algorithm = 'aes-256-ctr';
      const secretKey = process.env.SECRETKEY; // Asegúrate de definir esta variable de entorno
      const iv = crypto.randomBytes(16);

      const encrypt = (buffer: Buffer) => {
        const cipher = crypto.createCipheriv(
          algorithm,
          Buffer.from(secretKey, 'hex'),
          iv,
        );
        const encrypted = Buffer.concat([
          cipher.update(buffer),
          cipher.final(),
        ]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
      };

      const archivoBuffer = Buffer.from(archivo); // Convierte el archivo a un buffer para encriptarlo

      const archivoEncriptado = encrypt(archivoBuffer);

      const RegistroDocumento = this.RegistroDocumentosRepository.create({
        ...infoData,
        archivo: archivoEncriptado,
        idRegistroInformacion: registro_informacion,
        idTipoDocumento: TipoDocumentos,
        estado: 'PEN',
        fotoInicial: 0,
      });

      await this.RegistroDocumentosRepository.save(RegistroDocumento);

      return RegistroDocumento;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async update(id: number, updateRegistroDocumentoDto: UpdateRegistroDocumentoDto) {

    try {

      const { idRegistroInformacion, idTipoDocumento, archivo, ...infoData } =
        updateRegistroDocumentoDto;

      const registro_informacion =
        await this.RegistroInformacionRepository.findOneBy({
          id: idRegistroInformacion,
        });

      if (!registro_informacion) {
        throw new NotFoundException(
          `registro_informacion con ID ${idRegistroInformacion} no encontrada`,
        );
      }

      const TipoDocumentos = await this.TipoDocumentosRepository.findOneBy({
        id: idTipoDocumento,
      });

      if (!TipoDocumentos) {
        throw new NotFoundException(
          `TipoDocumentos con ID ${idTipoDocumento} no encontrada`,
        );
      }

      const registro_documento =
        await this.RegistroDocumentosRepository.findOneBy({ id });

      if (!registro_documento) {
        throw new NotFoundException(
          `registro_documento con ID ${id} no encontrada`,
        );
      }

      const algorithm = 'aes-256-ctr';
      const secretKey = process.env.SECRETKEY; // Asegúrate de definir esta variable de entorno
      const iv = crypto.randomBytes(16);

      const encrypt = (buffer: Buffer) => {
        const cipher = crypto.createCipheriv(
          algorithm,
          Buffer.from(secretKey, 'hex'),
          iv,
        );
        const encrypted = Buffer.concat([
          cipher.update(buffer),
          cipher.final(),
        ]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
      };

      const archivoBuffer = Buffer.from(archivo); // Convierte el archivo a un buffer para encriptarlo

      const archivoEncriptado = encrypt(archivoBuffer);

      const updateRegistroDocumento = this.RegistroDocumentosRepository.merge(
        registro_documento,
        {
          ...infoData,
          archivo: archivoEncriptado,
          idRegistroInformacion: registro_informacion,
          idTipoDocumento: TipoDocumentos,
        },
      );

      // Guardar los cambios en la base de datos
      await this.RegistroDocumentosRepository.save(updateRegistroDocumento);

      return updateRegistroDocumento;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async registrarDocumentoInicialFoto(user: string, fotoInicial: string) {
    try {
      let usuario: Usuarios;

      // Determinar si es email o teléfono y buscar usuario
      if (this.isEmail(user)) {
        usuario = await this.userRepository.findOne({
          where: { email: user, estado: 2 },
        });
      } else if (this.isPhoneNumber(user)) {
        usuario = await this.userRepository.findOne({
          where: { telefono: user, estado: 2 },
        });
      }

      if (!usuario) {
        throw new NotFoundException(
          `Usuario con identificador ${user} no encontrado`,
        );
      }

      const RegistroInformacion =
        await this.RegistroInformacionRepository.findOne({
          where: { idUsuario: usuario },
        });

      if (!RegistroInformacion) {
        throw new NotFoundException(
          `RegistroInformacion con usuario ${user} no encontrada`,
        );
      }

      const RegistrosDocumentos = await this.RegistroDocumentosRepository.find({
        where: { idRegistroInformacion: RegistroInformacion },
      });

      if (!RegistrosDocumentos) {
        throw new NotFoundException(
          `RegistroDocumento con registroInformacion ${RegistroInformacion} no encontrada`,
        );
      }

      const TiposDocumentos = await this.TipoDocumentosRepository.findOneBy({
        descripcion: 'foto_reciente',
      });

      if (!TiposDocumentos) {
        const createTipoDocumentos = this.TipoDocumentosRepository.create({
          descripcion: 'foto_reciente',
          necesitaValidacion: 'NO',
          tieneVencimiento: 'NO',
          tipoDocumento: 'JPG',
        });
        await this.TipoDocumentosRepository.save(createTipoDocumentos);
      }

      const TipoDocumento = await this.TipoDocumentosRepository.findOneBy({
        descripcion: 'foto_reciente',
      });

      let documentoExistente = RegistrosDocumentos.find(
        (doc) => doc.fotoInicial === 1,
      );

      if (documentoExistente) {
        (documentoExistente.estado = 'ACT'),
          (documentoExistente.archivo = fotoInicial);
        (documentoExistente.idTipoDocumento = TipoDocumento),
          await this.RegistroDocumentosRepository.save(documentoExistente);
      } else {
        // Si no existe, crear uno nuevo
        const nuevoDocumento = this.RegistroDocumentosRepository.create({
          idRegistroInformacion: RegistroInformacion,
          archivo: fotoInicial,
          fotoInicial: 1,
          estado: 'ACT',
          idTipoDocumento: TipoDocumento,
        });
        await this.RegistroDocumentosRepository.save(nuevoDocumento);
      }

      return true;
    } catch (error) {
      this.handleDBException(error);
      return false;
    }
  }

  async findAll(PaginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = PaginationDto;

    const RegistroDocumento = await this.RegistroDocumentosRepository.find({
      skip: offset,
      take: limit,
      relations: ['idRegistroInformacion', 'idTipoDocumento'],
    });

    return RegistroDocumento;
  }

  async findAllByRegistro(idUsuario: number) {
    const usuario = await this.userRepository.findOneBy({ id: idUsuario });

    const registro_informacion =
      await this.RegistroInformacionRepository.findOneBy({
        idUsuario: usuario,
      });

    const registroDocumento = await this.RegistroDocumentosRepository.find({
      where: {
        idRegistroInformacion: registro_informacion,
        estado: In(['ACT', 'PEN']),
      },
      relations: ['idRegistroInformacion', 'idTipoDocumento'],
    });

    return registroDocumento;
  }

  async acepatarDocumento(id: number) {
    try {
      const RegistroDocumento =
        await this.RegistroDocumentosRepository.findOneBy({ id });

      if (!RegistroDocumento) {
        throw new NotFoundException(
          `RegistroDocumento con ID ${id} not encontrado`,
        );
      }

      RegistroDocumento.estado = 'ACEP';
      return await this.RegistroDocumentosRepository.save(RegistroDocumento);
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {
    try {
      const RegistroDocumento =
        await this.RegistroDocumentosRepository.findOneBy({ id });

      if (!RegistroDocumento) {
        throw new NotFoundException(
          `RegistroDocumento con ID ${id} not encontrado`,
        );
      }

      RegistroDocumento.estado = 'INA';
      return await this.RegistroDocumentosRepository.save(RegistroDocumento);
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
