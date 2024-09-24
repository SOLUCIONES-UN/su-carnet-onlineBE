import { Injectable } from '@nestjs/common';
import { CreateRegistroInformacionDto } from './dto/create-registro_informacion.dto';
import { UpdateRegistroInformacionDto } from './dto/update-registro_informacion.dto';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuarios } from '../entities/Usuarios';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { Municipios } from '../entities/Municipios';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegistroInformacionService {

  constructor(
    @InjectRepository(RegistroInformacion)
    private RegistroInformacionRepository: Repository<RegistroInformacion>,

    @InjectRepository(Municipios)
    private MunicipiosRepository: Repository<Municipios>,

    @InjectRepository(Usuarios)
    private UsuariosRepository: Repository<Usuarios>,

    @InjectRepository(EmpresasInformacion)
    private EmpresasInformacionRepository: Repository<EmpresasInformacion>,

  ) { }

  // Función para transformar la fecha
  transformDate(dateString: string): string {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  }


  async existRegistro(Dpi: string) {

    return await this.RegistroInformacionRepository.findOne({ 
      where: {documento: Dpi}
    });
  }

  async existRegistroVisita(Dpi: string) {

    return await this.RegistroInformacionRepository.findOne({ 
      where: {documento: Dpi, estado: 'VISIT'},
      relations: ['idUsuario']
    });
  }


  async UpdateUserVisita(createRegistroInformacionDto: CreateRegistroInformacionDto, usuario:Usuarios){

    try {

      const registro_informacion = await this.RegistroInformacionRepository.findOneBy({ documento: createRegistroInformacionDto.documento });

      if (!registro_informacion) return new GenericResponse('400', `registro_informacion con documento ${createRegistroInformacionDto.documento} no encontrado `, []);

      const municipio = await this.MunicipiosRepository.findOneBy({ id: createRegistroInformacionDto.idMunicipio });

      if (!municipio) return new GenericResponse('400', `municipio con id ${createRegistroInformacionDto.idMunicipio} no encontrado `, []);

      // Generar la passwordSalt
      const passwordSalt = bcrypt.genSaltSync(10);

      // Hashear la contraseña con passwordSalt generada
      const passwordHash = bcrypt.hashSync(createRegistroInformacionDto.password, passwordSalt);

      // Convertir hash y sal a Buffer
      const passwordHashBuffer = Buffer.from(passwordHash, 'utf-8');
      const saltBuffer = Buffer.from(passwordSalt, 'utf-8');

      const updateUsuario = this.UsuariosRepository.merge(usuario,{
        nombres: createRegistroInformacionDto.nombres,
        apellidos:createRegistroInformacionDto.apellidos,
        telefono: createRegistroInformacionDto.telefono,
        email: createRegistroInformacionDto.correo,
        passwordhash: passwordHashBuffer,
        passwordsalt: saltBuffer,
        estado: 1
      });

      const usuarioGuardado = await this.UsuariosRepository.save(updateUsuario);

      if(!usuarioGuardado) return new GenericResponse('404', `No se pudo crear el usuario`, []);

      const update_registro_informacion = this.RegistroInformacionRepository.merge(registro_informacion, {
        nombres: createRegistroInformacionDto.nombres,
        apellidos: createRegistroInformacionDto.apellidos,
        contactoEmergenciaNombre: createRegistroInformacionDto.contactoEmergenciaNombre,
        contactoEmergenciaTelefono: createRegistroInformacionDto.contactoEmergenciaTelefono,
        direccionRecidencia: createRegistroInformacionDto.direccionRecidencia,
        documento: createRegistroInformacionDto.documento,
        fechaNacimiento: createRegistroInformacionDto.fechaNacimiento,
        genero: createRegistroInformacionDto.genero,
        telefono: createRegistroInformacionDto.telefono,
        correo: createRegistroInformacionDto.telefono,
        idMunicipio: municipio,
        idUsuario: usuarioGuardado,
        estado: 'ACT'
      })

      await this.RegistroInformacionRepository.save(update_registro_informacion);

      return new GenericResponse('200', `EXITO`, update_registro_informacion);

    } catch (error) {
      return new GenericResponse('500', `Error`, error.message);
    }

  }
  

  async create(createRegistroInformacionDto: CreateRegistroInformacionDto, usuario: Usuarios) {

    try {

      const { idMunicipio, nombres, apellidos, documento, telefono, correo, fechaNacimiento, ...infoData } = createRegistroInformacionDto;

      const municipio = await this.MunicipiosRepository.findOneBy({ id: idMunicipio });

      if (!municipio) {
        return new GenericResponse('401', `Municipios ${idMunicipio} not encontrado`, []);
      }

      const RegistroInformacion = this.RegistroInformacionRepository.create({
        ...infoData,
        idMunicipio: municipio,
        nombres: nombres,
        apellidos: apellidos,
        documento: documento,
        telefono: telefono,
        correo: correo,
        genero: createRegistroInformacionDto.genero,
        direccionRecidencia: createRegistroInformacionDto.direccionRecidencia,
        fechaNacimiento: fechaNacimiento,
        idUsuario: usuario,
        estado: 'ACT'
      });

      await this.RegistroInformacionRepository.save(RegistroInformacion);

      return new GenericResponse('200', `EXITO`, RegistroInformacion);

    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async findAllByUsuario(idUsuario: number) {

    try {
      const usuario = await this.UsuariosRepository.findOneBy({ id: idUsuario });
  
      if (!usuario) {
        return new GenericResponse('400', `Usuario no encontrado`, []);
      }
  
      const registroInformacion = await this.RegistroInformacionRepository.findOne({
        where: { idUsuario: usuario },
        relations: ['idMunicipio.iddepartamento.idpais', 'idUsuario.idTipo','idUsuario.role', 'idUsuario.areaSucursal.idSucursal.idEmpresa'],
      });
  
      return new GenericResponse('200', `EXITO`, registroInformacion);
    } catch (error) {
      return new GenericResponse('500', `Error`, error.message);
    }
  }


  async findAll() {

    try {

      const RegistroInformacion = await this.RegistroInformacionRepository.find({
        relations: ['idMunicipio.iddepartamento.idpais', 'idUsuario.idTipo','idUsuario.role', 'idUsuario.areaSucursal.idSucursal.idEmpresa'],
      });

      return new GenericResponse('200', `EXITO`, RegistroInformacion);
    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async findAllByEmpresa(idEmpresa: number) {

    try {

      const empresa = await this.EmpresasInformacionRepository.findOne({ where: { id: idEmpresa } });
      if (!empresa) {
        return new GenericResponse('400', `Empresa no encontrada`, []);
      }
  
      const registroInformacion = await this.RegistroInformacionRepository.find({
        where: {
          estado: 'ACT', 
          idUsuario: {
            areaSucursal: {
              idSucursal: {
                idEmpresa: empresa, 
              },
            },
          },
        },
        relations: [
          'idMunicipio.iddepartamento.idpais', 
          'idUsuario.idTipo', 
          'idUsuario.role', 
          'idUsuario.areaSucursal.idSucursal.idEmpresa',
        ],
      });
  
      return new GenericResponse('200', `ÉXITO`, registroInformacion);
    } catch (error) {
      return new GenericResponse('500', `Error`, error.message);
    }
  }


  async update(id: number, updateRegistroInformacionDto: UpdateRegistroInformacionDto) {

    try {

      const { idMunicipio, idUsuario, nombres, apellidos, documento, telefono, correo, fechaNacimiento, ...infoData } = updateRegistroInformacionDto;

      const registro_informacion = await this.RegistroInformacionRepository.findOneBy({ id });

      if (!registro_informacion) return new GenericResponse('400', `registro_informacion con id ${id} no encontrado `, []);

      const municipio = await this.MunicipiosRepository.findOneBy({ id: idMunicipio });

      if (!municipio) return new GenericResponse('400', `municipio con id ${idMunicipio} no encontrado `, []);

      const usuario = await this.UsuariosRepository.findOneBy({ id: idUsuario });

      if (!usuario) return new GenericResponse('400', `usuario con id ${idUsuario} no encontrado `, []);

      const update_registro_informacion = this.RegistroInformacionRepository.merge(registro_informacion, {
        idMunicipio: municipio,
        idUsuario: usuario,
        documento: updateRegistroInformacionDto.documento,
        nombres: updateRegistroInformacionDto.nombres,
        apellidos: updateRegistroInformacionDto.apellidos,
        fechaNacimiento: updateRegistroInformacionDto.fechaNacimiento,
        telefono: updateRegistroInformacionDto.telefono,
        correo: updateRegistroInformacionDto.correo,
        direccionRecidencia: updateRegistroInformacionDto.direccionRecidencia,
        contactoEmergenciaNombre: updateRegistroInformacionDto.contactoEmergenciaNombre,
        contactoEmergenciaTelefono: updateRegistroInformacionDto.contactoEmergenciaTelefono,
        genero: updateRegistroInformacionDto.genero
      });

      await this.RegistroInformacionRepository.save(update_registro_informacion);

      return new GenericResponse('200', `EXITO`, update_registro_informacion);

    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async remove(id: number) {

    try {

      const RegistroInformacion = await this.RegistroInformacionRepository.findOneBy({ id: id });

      if (!RegistroInformacion) {
        return new GenericResponse('401', `RegistroInformacion con ID ${id} not encontrado`, RegistroInformacion);
      }

      const usuario = await this.UsuariosRepository.findOneBy({ registroInformacions: RegistroInformacion });

      if (!usuario) {
        return new GenericResponse('401', `El usuario con ID ${id} not encontrado`, usuario);
      }

      usuario.estado = 0;
      await this.UsuariosRepository.save(usuario);

      RegistroInformacion.estado = 'INA';
      await this.RegistroInformacionRepository.save(RegistroInformacion);

      return new GenericResponse('200', `EXITO`, RegistroInformacion);

    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

}
