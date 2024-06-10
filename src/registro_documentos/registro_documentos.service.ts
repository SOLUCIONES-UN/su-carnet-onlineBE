import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateRegistroDocumentoDto } from './dto/create-registro_documento.dto';
import { RegistroDocumentos } from '../entities/RegistroDocumentos';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { TipoDocumentos } from '../entities/TipoDocumentos';
import * as bcrypt from 'bcrypt';
import { PaginationDto } from '../common/dtos/pagination.dto';
import * as fs from 'fs';
import * as path from 'path';

import { RekognitionClient, CompareFacesCommand } from "@aws-sdk/client-rekognition";
import { TextractClient, AnalyzeDocumentCommand, FeatureType } from "@aws-sdk/client-textract";

@Injectable()
export class RegistroDocumentosService {

  private readonly logger = new Logger("RegistroDocumentosService");
  private rekognitionClient: RekognitionClient;
  private textractClient: TextractClient;

  constructor(
    @InjectRepository(RegistroDocumentos)
    private RegistroDocumentosRepository: Repository<RegistroDocumentos>,

    @InjectRepository(RegistroInformacion)
    private RegistroInformacionRepository: Repository<RegistroInformacion>,

    @InjectRepository(TipoDocumentos)
    private TipoDocumentosRepository: Repository<TipoDocumentos>

  ) {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const region = process.env.AWS_REGION;

    this.rekognitionClient = new RekognitionClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      }
    });
    this.textractClient = new TextractClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      }
    });
  }


  private readImageFromFile(filePath: string): Buffer {
    const absolutePath = path.resolve(filePath);
    return fs.readFileSync(absolutePath);
  }

  //Funcion para verificar persona por medio de reconocimiento facial 
  async compareFaces(sourceImagePath: string, targetImagePath: string): Promise<boolean> {
    const sourceImageBuffer = this.readImageFromFile(sourceImagePath);
    const targetImageBuffer = this.readImageFromFile(targetImagePath);

    const params = {
      SourceImage: { Bytes: sourceImageBuffer },
      TargetImage: { Bytes: targetImageBuffer },
      SimilarityThreshold: 90
    };

    const command = new CompareFacesCommand(params);
    const response = await this.rekognitionClient.send(command);
    return response.FaceMatches.length > 0;
  }

  async extractText(documentImagePath: string): Promise<string> {
    const documentImageBuffer = this.readImageFromFile(documentImagePath);

    const params = {
      Document: { Bytes: documentImageBuffer },
      FeatureTypes: [FeatureType.FORMS]
    };

    const command = new AnalyzeDocumentCommand(params);
    const response = await this.textractClient.send(command);
    return response.Blocks.map(block => block.Text).join(' ');
  }


  // Función para transformar la fecha
  transformDate(dateString: string): string {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  }

  async create(createRegistroDocumentoDto: CreateRegistroDocumentoDto) {

    try {
      const { idRegistroInformacion, idTipoDocumento, archivo, ...infoData } = createRegistroDocumentoDto;

      const registro_informacion = await this.RegistroInformacionRepository.findOneBy({ id: idRegistroInformacion });

      const TipoDocumentos = await this.TipoDocumentosRepository.findOneBy({ id: idTipoDocumento });

      if (!registro_informacion) {
        throw new NotFoundException(`registro_informacion con ID ${idRegistroInformacion} no encontrada`);
      }

      if (!TipoDocumentos) {
        throw new NotFoundException(`TipoDocumentos con ID ${idRegistroInformacion} no encontrada`);
      }

      const saltRounds = 10;

      const [ archivoEncript] = await Promise.all([
        bcrypt.hash(archivo, saltRounds),
      ]);

      const fechaVencimientoTransformada = this.transformDate(createRegistroDocumentoDto.fechaVencimiento);

      const RegistroDocumento = this.RegistroDocumentosRepository.create({
        ...infoData,
        archivo: archivoEncript,
        idRegistroInformacion: registro_informacion,
        idTipoDocumento: TipoDocumentos,
        fechaVencimiento: fechaVencimientoTransformada,
        estado: 'PEN'
      });

      await this.RegistroDocumentosRepository.save(RegistroDocumento);

      return RegistroDocumento;

    } catch (error) {
      this.handleDBException(error);
    }

  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const RegistroDocumento = await this.RegistroDocumentosRepository.find({
      skip: offset,
      take: limit,
      relations: ['idRegistroInformacion', "idTipoDocumento"],
    });

    return RegistroDocumento;
  }


  async acepatarDocumento(id: number) {

    try {

      const RegistroDocumento = await this.RegistroDocumentosRepository.findOneBy({ id });

      if (!RegistroDocumento) {
        throw new NotFoundException(`RegistroDocumento con ID ${id} not encontrado`);
      }

      RegistroDocumento.estado = 'ACEP';
      return await this.RegistroDocumentosRepository.save(RegistroDocumento);

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {

    try {

      const RegistroDocumento = await this.RegistroDocumentosRepository.findOneBy({ id });

      if (!RegistroDocumento) {
        throw new NotFoundException(`RegistroDocumento con ID ${id} not encontrado`);
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
