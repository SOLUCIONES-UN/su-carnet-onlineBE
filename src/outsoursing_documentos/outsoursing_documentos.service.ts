import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateOutsoursingDocumentoDto } from './dto/create-outsoursing_documento.dto';
import { OutsoursingDocumentos } from '../entities/OutsoursingDocumentos';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegistroDocumentos } from '../entities/RegistroDocumentos';
import { OutsoursingInformacion } from '../entities/OutsoursingInformacion';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class OutsoursingDocumentosService {

  private readonly logger = new Logger("OutsoursingDocumentosService");

  constructor(
    @InjectRepository(OutsoursingDocumentos)
    private OutsoursingDocumentosRepository: Repository<OutsoursingDocumentos>,

    @InjectRepository(RegistroDocumentos)
    private RegistroDocumentosRepository: Repository<RegistroDocumentos>,

    @InjectRepository(OutsoursingInformacion)
    private OutsoursingInformacionRepository: Repository<OutsoursingInformacion>

  ) { }

  async create(createOutsoursingDocumentoDto: CreateOutsoursingDocumentoDto) {
    
    try {
  
      const outsoursingInformacion = await this.OutsoursingInformacionRepository.findOneBy({ id: createOutsoursingDocumentoDto.idOutsoursing });
  
      if (!outsoursingInformacion) {
        throw new NotFoundException(`sucursalesAreasPuertas con ID ${createOutsoursingDocumentoDto.idOutsoursing} no encontrada`);
      }

      const RegistroDocumentos = await this.RegistroDocumentosRepository.findOneBy({id:createOutsoursingDocumentoDto.idDocumento});

      if(!RegistroDocumentos){
        throw new NotFoundException(`RegistroDocumentos con ID ${createOutsoursingDocumentoDto.idDocumento} no encontrado`);
      }
  
      const outsoursingDocumentos = this.OutsoursingDocumentosRepository.create({
        idOutsoursing: outsoursingInformacion,
        idDocumento: RegistroDocumentos
      });
  
      await this.OutsoursingDocumentosRepository.save(outsoursingDocumentos);
  
      return outsoursingDocumentos; 

    } catch (error) {
      this.handleDBException(error);
    }
  }
  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const outsoursingServicios = await this.OutsoursingDocumentosRepository.find({
      skip: offset,
      take: limit,
      relations: ['idOutsoursing', 'idDocumento'],
    });
    
    return outsoursingServicios;
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(`Error : ${error.message}`);
    throw new InternalServerErrorException('Error ');
  }
}
