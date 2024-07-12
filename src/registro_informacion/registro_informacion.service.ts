import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateRegistroInformacionDto } from './dto/create-registro_informacion.dto';
import { UpdateRegistroInformacionDto } from './dto/update-registro_informacion.dto';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { TipoPaises } from '../entities/TipoPaises';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';
import * as bcrypt from 'bcrypt';
import { Usuarios } from '../entities/Usuarios';
import * as crypto from 'crypto';

@Injectable()
export class RegistroInformacionService {

  private readonly logger = new Logger("RegistroInformacionService");

  constructor(
    @InjectRepository(RegistroInformacion)
    private RegistroInformacionRepository: Repository<RegistroInformacion>,

    @InjectRepository(TipoPaises)
    private TipoPaisesRepository: Repository<TipoPaises>,

    @InjectRepository(Usuarios)
    private UsuariosRepository: Repository<Usuarios>,

  ) { }

  // Función para transformar la fecha
  transformDate(dateString: string): string {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  }


  async existRegistro(Dpi: string) {

    return await this.RegistroInformacionRepository.findOneBy({ documento: Dpi });
  }


  async create(createRegistroInformacionDto: CreateRegistroInformacionDto, usuario: Usuarios) {

    try {

      const { idPais, nombres, apellidos, documento, telefono, correo, fechaNacimiento, ...infoData } = createRegistroInformacionDto;

      const TipoPaises = await this.TipoPaisesRepository.findOneBy({ id: idPais });

      if (!TipoPaises) {
        throw new NotFoundException(`TipoPaises con ID ${idPais} no encontrada`);
      }

      // const algorithm = 'aes-256-ctr';
      // const secretKey = process.env.SECRETKEY; 
      // const iv = crypto.randomBytes(16);

      // const encrypt = (text: string) => {
      //   const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
      //   const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
      //   return iv.toString('hex') + ':' + encrypted.toString('hex');
      // };

      // const documentoEncrypted = encrypt(documento);
      // const nombresEncrypted = encrypt(nombres);
      // const apellidosEncrypted = encrypt(apellidos);
      // const telefonoEncrypted = encrypt(telefono);
      // const correoEncrypted = encrypt(correo);

      const RegistroInformacion = this.RegistroInformacionRepository.create({
        ...infoData,
        idPais: TipoPaises,
        idUsuario: usuario,
        estado: 'ACT'
      });

      await this.RegistroInformacionRepository.save(RegistroInformacion);

      return RegistroInformacion;

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAllByUsuario(idUsuario: number) {

    const usuario = await this.UsuariosRepository.findOneBy({ id: idUsuario });
    return await this.RegistroInformacionRepository.findOneBy({ idUsuario: usuario });
  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const RegistroInformacion = await this.RegistroInformacionRepository.find({
      skip: offset,
      take: limit,
      relations: ['idPais', 'idUsuario'],
    });

    return RegistroInformacion;
  }

  async update(id: number, updateRegistroInformacionDto: UpdateRegistroInformacionDto) {

    try {

      const { idPais, idUsuario, nombres, apellidos, documento, telefono, correo, fechaNacimiento, ...infoData } = updateRegistroInformacionDto;

      const registro_informacion = await this.RegistroInformacionRepository.findOneBy({ id });

      if (!registro_informacion) {
        throw new NotFoundException(`registro_informacion con ID ${id} no encontrado`);
      }

      const TipoPaises = await this.TipoPaisesRepository.findOneBy({ id: idPais });

      if (!TipoPaises) {
        throw new NotFoundException(`TipoPaises con ID ${idPais} no encontrado`);
      }

      const usuario = await this.UsuariosRepository.findOneBy({ id: idUsuario });

      if (!usuario) {
        throw new NotFoundException(`usuario con ID ${idUsuario} no encontrado`);
      }

      // const algorithm = 'aes-256-ctr';
      // const secretKey = process.env.SECRETKEY; 
      // const iv = crypto.randomBytes(16);

      // const encrypt = (text: string) => {
      //   const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
      //   const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
      //   return iv.toString('hex') + ':' + encrypted.toString('hex');
      // };

      // const documentoEncrypted = encrypt(documento);
      // const nombresEncrypted = encrypt(nombres);
      // const apellidosEncrypted = encrypt(apellidos);
      // const telefonoEncrypted = encrypt(telefono);
      // const correoEncrypted = encrypt(correo);

      const update_registro_informacion = this.RegistroInformacionRepository.merge(registro_informacion, {
        ...infoData,
        idPais: TipoPaises,
        idUsuario: usuario
      });

      // Guardar los cambios en la base de datos
      await this.RegistroInformacionRepository.save(update_registro_informacion);

      return update_registro_informacion;

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {

    try {

      const RegistroInformacion = await this.RegistroInformacionRepository.findOneBy({ id });

      if (!RegistroInformacion) {
        throw new NotFoundException(`RegistroInformacion con ID ${id} not encontrado`);
      }

      RegistroInformacion.estado = 'INA';
      return await this.RegistroInformacionRepository.save(RegistroInformacion);

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
