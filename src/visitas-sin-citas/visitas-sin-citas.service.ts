import { Injectable } from '@nestjs/common';
import { CreateVisitasSinCitaDto } from './dto/create-visitas-sin-cita.dto';
import { UpdateVisitasSinCitaDto } from './dto/update-visitas-sin-cita.dto';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { Municipios } from '../entities/Municipios';
import { Usuarios } from '../entities/Usuarios';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { TipoUsuario } from '../entities/TipoUsuario';

@Injectable()
export class VisitasSinCitasService {

  constructor(

    @InjectRepository(RegistroInformacion)
    private RegistroInformacionRepository: Repository<RegistroInformacion>,

    @InjectRepository(Municipios)
    private MunicipiosRepository: Repository<Municipios>,

    @InjectRepository(Usuarios)
    private UsuariosRepository: Repository<Usuarios>,

    @InjectRepository(TipoUsuario)
    private TipoUsuarioRepository: Repository<TipoUsuario>,

  ) { }

  async create(createVisitasSinCitaDto: CreateVisitasSinCitaDto) {
    
    try {

      const codigoMunicipio = createVisitasSinCitaDto.documentoIdentificacion.slice(-4);

      const municipio = await this.MunicipiosRepository.findOneBy({codigoMunicipio: codigoMunicipio});

      const tipoUsuario = await this.TipoUsuarioRepository.findOneBy({descripcion: 'aplicacion'});

      if(!tipoUsuario)  return new GenericResponse('400', 'tipo usuario aplicacion no encontrado', []);
  
      const usuario = this.UsuariosRepository.create({
        nombres: createVisitasSinCitaDto.nombre,
        apellidos: createVisitasSinCitaDto.apellido,
        idTipo: tipoUsuario,
        estado: 3
      });

      await this.UsuariosRepository.save(usuario);
  
      if (!usuario) {
        return new GenericResponse('401', 'Error al crear el usuario', usuario);
      }

      const RegistroInformacion = this.RegistroInformacionRepository.create({
        nombres: createVisitasSinCitaDto.nombre,
        apellidos: createVisitasSinCitaDto.apellido,
        documento: createVisitasSinCitaDto.documentoIdentificacion,
        idMunicipio: municipio,
        idUsuario: usuario,
        estado: 'VISIT'
      });

      await this.RegistroInformacionRepository.save(RegistroInformacion);
      return new GenericResponse('200', `EXITO`, RegistroInformacion);
      
    } catch (error) {
      return new GenericResponse('500', `Error al guardar`, error);
    }
  }

  async findAll() {

    try {

      const RegistrosInformacion = await this.RegistroInformacionRepository.find({
        where: { estado: 'VISIT' }
      });
      
      return new GenericResponse('200', `EXITO`, RegistrosInformacion);
    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async findOne(id: number) {
    return `This action returns a #${id} visitasSinCita`;
  }

  async update(id: number, updateVisitasSinCitaDto: UpdateVisitasSinCitaDto) {
    return `This action updates a #${id} visitasSinCita`;
  }

  async remove(id: number) {
    return `This action removes a #${id} visitasSinCita`;
  }
}
