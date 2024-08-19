import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateRegistroMembresiaDto } from './dto/create-registro_membresia.dto';
import { UpdateRegistroMembresiaDto } from './dto/update-registro_membresia.dto';
import { RegistroMembresia } from '../entities/RegistroMembresia';
import { InjectRepository } from '@nestjs/typeorm';
import { MembresiaInformacion } from '../entities/MembresiaInformacion';
import { Repository } from 'typeorm';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Usuarios } from '../entities/Usuarios';
import { GenericResponse } from '../common/dtos/genericResponse.dto';

@Injectable()
export class RegistroMembresiasService {

  private readonly logger = new Logger("RegistroMembresiasService");

  constructor(

    @InjectRepository(RegistroMembresia)
    private RegistroMembresiaRepository: Repository<RegistroMembresia>,

    @InjectRepository(MembresiaInformacion)
    private MembresiaInformacionRepository: Repository<MembresiaInformacion>,

    @InjectRepository(RegistroInformacion)
    private RegistroInformacionRepository: Repository<RegistroInformacion>,

    @InjectRepository(Usuarios)
    private UsuariosRepository: Repository<Usuarios>,
  )
  { }

  async create(createRegistroMembresiaDto: CreateRegistroMembresiaDto) {
    
    try {

      const {membresiaInformacion, registroInformacion, ...infoData} = createRegistroMembresiaDto;

      const membresia_informacion = await this.MembresiaInformacionRepository.findOneBy({ id: membresiaInformacion });
  
      if (!membresia_informacion) {
        throw new NotFoundException(`membresia_informacion con ID ${membresiaInformacion} no encontrado`);
      }

      const registro_informacion = await this.RegistroInformacionRepository.findOneBy({id: registroInformacion});

      if (!registro_informacion) {
        throw new NotFoundException(`registro_informacion con ID ${registro_informacion} no encontrado`);
      }
  
      const registro_membresia = this.RegistroMembresiaRepository.create({
        ...infoData,
        membresiaInformacion: membresia_informacion,
        registroInformacion: registro_informacion
      });
      
      await this.RegistroMembresiaRepository.save(registro_membresia);
  
      return registro_membresia;
  
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const registro_membresia = await this.RegistroMembresiaRepository.find({
      where: {estado: 1},
      skip: offset,
      take: limit,
      relations: ['membresiaInformacion', 'registroInformacion'],
    });
    
    return registro_membresia;
  }

  async membresiasUsuario(idUsuario: number){

    try {
      const usuario = await this.UsuariosRepository.findOneBy({id:idUsuario});

      if(!usuario){
        return new GenericResponse('401', `Usuario con ID ${idUsuario} no encontrado`, null);
      }

      const registroInformacion = await this.RegistroInformacionRepository.findOneBy({idUsuario: usuario});

      if(!registroInformacion){
        return new GenericResponse('401', `Registro informacion con usuario ${usuario.nombres} no encontrada`, null);
      }

      const membresias = await this.RegistroMembresiaRepository.find({
        where: {registroInformacion: registroInformacion, estado:1},
        relations: ['membresiaInformacion.tipoMembresia', 'membresiaInformacion.empresa', 'registroInformacion.idUsuario'],
      })

      return new GenericResponse('200', `EXITO`, membresias);

    } catch (error) {
      return new GenericResponse('500', `Error al consultar`, error);
    }
  }


  async membresiasEmpresas(idEmpresa: number) {
    try {
      const membresias = await this.RegistroMembresiaRepository.find({
        where: {
          estado: 1,
          membresiaInformacion: {
            empresa: {
              id: idEmpresa,
            },
          },
        },
        relations: ['membresiaInformacion.tipoMembresia', 'membresiaInformacion.empresa'],
      });
  
      return new GenericResponse('200', `ÉXITO`, membresias);
    } catch (error) {
      return new GenericResponse('500', `Error al consultar`, error);
    }
  }

  async findOne(id: number) {
    return this.RegistroMembresiaRepository.findOneBy({ id });
  }

  async update(id: number, updateRegistroMembresiaDto: UpdateRegistroMembresiaDto) {
    
    try {

      const {membresiaInformacion, registroInformacion, ...infoData} = updateRegistroMembresiaDto;

      const membresia_informacion = await this.MembresiaInformacionRepository.findOneBy({ id: membresiaInformacion });
  
      if (!membresia_informacion) {
        throw new NotFoundException(`membresia_informacion con ID ${membresiaInformacion} no encontrado`);
      }

      const registro_informacion = await this.RegistroInformacionRepository.findOneBy({id: registroInformacion});

      if (!registro_informacion) {
        throw new NotFoundException(`registro_informacion con ID ${registro_informacion} no encontrado`);
      }

      const registro_membresia = await this.RegistroMembresiaRepository.findOneBy({id: id});
  
      const updated_registro_membresia = this.RegistroMembresiaRepository.merge(registro_membresia, {
        ...infoData,
        membresiaInformacion: membresia_informacion,
        registroInformacion: registro_informacion
      });
  
      await this.RegistroMembresiaRepository.save(updated_registro_membresia);
  
      return updated_registro_membresia;
  
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {

    try {

      const registro_membresia = await this.findOne(id);

      if (!registro_membresia) {
        throw new NotFoundException(`registro_membresia con ID ${id} not encontrado`);
      }

      registro_membresia.estado = 0;

      return await this.RegistroMembresiaRepository.save(registro_membresia);

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
