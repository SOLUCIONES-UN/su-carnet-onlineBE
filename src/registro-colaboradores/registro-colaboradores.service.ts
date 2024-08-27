import { Injectable } from '@nestjs/common';
import { CreateRegistroColaboradoreDto } from './dto/create-registro-colaboradore.dto';
import { UpdateRegistroColaboradoreDto } from './dto/update-registro-colaboradore.dto';
import { RegistroColaboradores } from '../entities/RegistroColaboradores';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { Usuarios } from '../entities/Usuarios';
import { GenericResponse } from '../common/dtos/genericResponse.dto';

@Injectable()
export class RegistroColaboradoresService {

  constructor(
    @InjectRepository(RegistroColaboradores)
    private RegistroColaboradoresRepository: Repository<RegistroColaboradores>,

    @InjectRepository(EmpresasInformacion)
    private empresaRepository: Repository<EmpresasInformacion>,

    @InjectRepository(Usuarios)
    private UsuariosRepository: Repository<Usuarios>,
  ) {}

  async create(createRegistroColaboradoreDto: CreateRegistroColaboradoreDto) {
    
    try {
      
      const usuario = await this.UsuariosRepository.findOneBy({
        id: createRegistroColaboradoreDto.idUsuario,
      });

      if (!usuario) return new GenericResponse('400', `No se encontro el usuario con id ${createRegistroColaboradoreDto.idUsuario}`, null);

      const empresaInformacion = await this.empresaRepository.findOneBy({id: createRegistroColaboradoreDto.idEmpresa});

      if(!empresaInformacion) return new GenericResponse('400', `No se encontro la empresa con id ${createRegistroColaboradoreDto.idEmpresa}`, null);

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

      await this.RegistroColaboradoresRepository.save(RegistroColaboradores);

      return new GenericResponse('200', `EXITO`, RegistroColaboradores);

    } catch (error) {
      return new GenericResponse('500', `Error al enviar solicitud`, error);
    }
  }

  async findAll() {
    return `This action returns all registroColaboradores`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} registroColaboradore`;
  }

  async update(id: number, updateRegistroColaboradoreDto: UpdateRegistroColaboradoreDto) {
    return `This action updates a #${id} registroColaboradore`;
  }

  async remove(id: number) {
    return `This action removes a #${id} registroColaboradore`;
  }
}
