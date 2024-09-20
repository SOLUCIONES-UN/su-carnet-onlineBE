import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateOutsoursingDocumentoDto } from './dto/create-outsoursing_documento.dto';
import { OutsoursingDocumentos } from '../entities/OutsoursingDocumentos';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegistroDocumentos } from '../entities/RegistroDocumentos';
import { OutsoursingInformacion } from '../entities/OutsoursingInformacion';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { EmpresasDocumentos } from '../entities/EmpresasDocumentos';

@Injectable()
export class OutsoursingDocumentosService {

  constructor(
    @InjectRepository(OutsoursingDocumentos)
    private OutsoursingDocumentosRepository: Repository<OutsoursingDocumentos>,

    @InjectRepository(EmpresasDocumentos)
    private EmpresasDocumentosRepository: Repository<EmpresasDocumentos>,

    @InjectRepository(OutsoursingInformacion)
    private OutsoursingInformacionRepository: Repository<OutsoursingInformacion>,

    @InjectRepository(EmpresasInformacion)
    private EmpresasInformacionRepository: Repository<EmpresasInformacion>

  ) { }

  async create(createOutsoursingDocumentoDto: CreateOutsoursingDocumentoDto) {
    
    try {
  
      const outsoursingInformacion = await this.OutsoursingInformacionRepository.findOneBy({ id: createOutsoursingDocumentoDto.idOutsoursing });
  
      if (!outsoursingInformacion) {
        return new GenericResponse('400', `outsoursingInformacion con id ${createOutsoursingDocumentoDto.idOutsoursing} no encontrado `, []);
      }

      const empresaDocumentos = await this.EmpresasDocumentosRepository.findOneBy({id:createOutsoursingDocumentoDto.idDocumento});

      if(!RegistroDocumentos){
        return new GenericResponse('400', `RegistroDocumentos con id ${createOutsoursingDocumentoDto.idDocumento} no encontrado `, []);
      }
  
      const existeDocumento = await this.OutsoursingDocumentosRepository.findOne({
        where: { idDocumento: empresaDocumentos, idOutsoursing: outsoursingInformacion }
      });
  
      if (!existeDocumento) {
        const OutsoursingDocumentos = this.OutsoursingDocumentosRepository.create({
          idDocumento: empresaDocumentos,
          idOutsoursing: outsoursingInformacion,
          estado: 1  
        });
  
        await this.OutsoursingDocumentosRepository.save(OutsoursingDocumentos);
  
        return new GenericResponse('200', `EXITO`, OutsoursingDocumentos);
  
      } else {
        Object.assign(existeDocumento); 
        existeDocumento.estado = 1; 
  
        await this.OutsoursingDocumentosRepository.save(existeDocumento);
  
        return new GenericResponse('200', `EXITO`, existeDocumento);
      }

    } catch (error) {
      return new GenericResponse('500', `Error `, error); 
    }
  }

  async findAll() {

   try {

    const outsoursingDocumentos = await this.OutsoursingDocumentosRepository.find({
      where: {estado:1},
      relations: ['idOutsoursing', 'idDocumento.idTipoDocumento', 'idDocumento.idEmpresa'],
    });
    
    return new GenericResponse('200', `EXITO `, outsoursingDocumentos); 
   } catch (error) {
    return new GenericResponse('500', `Error `, error); 
   }
  }

  async findAllByEmpresa(idEmpresa: number) {
    try {
      const empresa = await this.EmpresasInformacionRepository.findOne({ where: { id: idEmpresa } });
      
      if (!empresa) {
        return new GenericResponse('404', 'Empresa no encontrada', null);
      }
  
      const outsoursingDocumentos = await this.OutsoursingDocumentosRepository
        .createQueryBuilder('outsoursingDocumentos')
        .innerJoinAndSelect('outsoursingDocumentos.idDocumento', 'empresasDocumentos')
        .innerJoinAndSelect('outsoursingDocumentos.idOutsoursing', 'outsoursingInformacion')
        .innerJoinAndSelect('empresasDocumentos.idEmpresa', 'empresa') // Une con la empresa
        .innerJoinAndSelect('empresasDocumentos.idTipoDocumento', 'tipoDocumentos') // Une con el tipo de documento
        .where('empresa.id = :idEmpresa', { idEmpresa }) // Filtra por la empresa
        .andWhere('outsoursingDocumentos.estado = :estado', { estado: 1 }) // Filtra por documentos activos
        .getMany();
  
      return new GenericResponse('200', 'EXITO', outsoursingDocumentos);
    } catch (error) {
      return new GenericResponse('500', 'Error en la consulta', error.message);
    }
  }


  async findAllByOutsoursingInformacion(idOutsoursing: number) {

    try {

      const outsoursingInformacion = await this.OutsoursingInformacionRepository.findOneBy({id: idOutsoursing});

      if(!outsoursingInformacion)  return new GenericResponse('404', `outsoursingInformacion no encontrado `, []); 
 
     const outsoursingDocumentos = await this.OutsoursingDocumentosRepository.find({
       where: {estado:1, idOutsoursing:outsoursingInformacion},
       relations: ['idOutsoursing', 'idDocumento.idTipoDocumento', 'idDocumento.idEmpresa'],
     });
     
     return new GenericResponse('200', `EXITO `, outsoursingDocumentos); 
    } catch (error) {
     return new GenericResponse('500', `Error `, error); 
    }
   }

  async remove(id: number) {

    try {

      const outsoursingDocumentos = await this.OutsoursingDocumentosRepository.findOneBy({id:id});

      if (!outsoursingDocumentos) {
        return new GenericResponse('400', `No se encontro outsoursingDocumentos`, outsoursingDocumentos);
      }

      outsoursingDocumentos.estado = 0;

      await this.OutsoursingDocumentosRepository.save(outsoursingDocumentos);
      
      return new GenericResponse('200', `EXITO `, outsoursingDocumentos); 

    } catch (error) {
      return new GenericResponse('500', `Error al eliminar`, error);
    }

  }
}
