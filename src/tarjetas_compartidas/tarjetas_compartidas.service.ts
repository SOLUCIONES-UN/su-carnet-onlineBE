import { Injectable } from '@nestjs/common';
import { CreateTarjetasCompartidaDto } from './dto/create-tarjetas_compartida.dto';
import { UpdateTarjetasCompartidaDto } from './dto/update-tarjetas_compartida.dto';
import { Tarjetascompartidas } from '../entities/Tarjetascompartidas';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TarjetaPresentacion } from '../entities/TarjetaPresentacion';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { Usuarios } from '../entities/Usuarios';
import { RegistroInformacion } from '../entities/RegistroInformacion';

@Injectable()
export class TarjetasCompartidasService {
  constructor(

    @InjectRepository(Tarjetascompartidas)
    private TarjetascompartidasRepository: Repository<Tarjetascompartidas>,

    @InjectRepository(TarjetaPresentacion)
    private TarjetaPresentacionRepository: Repository<TarjetaPresentacion>,

    @InjectRepository(Usuarios)
    private UsuariosRepository: Repository<Usuarios>,

    @InjectRepository(RegistroInformacion)
    private RegistroInformacionRepository: Repository<RegistroInformacion>,

  ) { }

  async create(createTarjetasCompartidaDto: CreateTarjetasCompartidaDto) {

    try {

      const tarjetaPresentacion = await this.TarjetaPresentacionRepository.findOneBy({ id: createTarjetasCompartidaDto.idtarjetaleida });

      if (!tarjetaPresentacion) return new GenericResponse('400', 'tarjeta no encontrada no encontrada', []);

      const usuario = await this.UsuariosRepository.findOneBy({ id: createTarjetasCompartidaDto.idusuario });

      const registroInformacion = await this.RegistroInformacionRepository.findOneBy({idUsuario:usuario});

      if (!usuario) return new GenericResponse('400', 'usuario no encontrado', []);

      const tarjetaCompartida = this.TarjetascompartidasRepository.create({
        idtarjetaleida: tarjetaPresentacion,
        idRegistroInformacion: registroInformacion
      });

      await this.TarjetascompartidasRepository.save(tarjetaCompartida);
      return new GenericResponse('200', `EXITO`, tarjetaCompartida);

    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async findAll() {

    try {

      const tarjetasCompartida = await this.TarjetascompartidasRepository.find({
        where: { estado: 1 },
        relations: ['idtarjetaleida.idEmpresa', 'idtarjetaleida.idUsuario']
      });

      return new GenericResponse('200', `EXITO`, tarjetasCompartida);
    } catch (error) {
      return new GenericResponse('500', `Error`, error.message);
    }

  }

  async findAllByUsuario(idusuario: number) {

    try {

      const usuario = await this.UsuariosRepository.findOneBy({ id: idusuario });

      if (!usuario) return new GenericResponse('400', `Usuario no encontrado`, []);

      const registroInformacion = await this.RegistroInformacionRepository.findOneBy({idUsuario: usuario});

      const tarjetasCompartida = await this.TarjetascompartidasRepository.find({
        where: { estado: 1, idRegistroInformacion: registroInformacion },
        relations: ['idtarjetaleida.idEmpresa', 'idtarjetaleida.idUsuario']
      });

      return new GenericResponse('200', `EXITO`, tarjetasCompartida);
    } catch (error) {
      return new GenericResponse('500', `Error`, error.message);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} tarjetasCompartida`;
  }

  update(id: number, updateTarjetasCompartidaDto: UpdateTarjetasCompartidaDto) {
    return `This action updates a #${id} tarjetasCompartida`;
  }

  async remove(id: number) {

    try {

      const tarjetaCompartida = await this.TarjetascompartidasRepository.findOneBy({ id: id });

      if (!tarjetaCompartida) {
        return new GenericResponse('400', `tarjetaCompartida no encontrada`, []);
      }

      tarjetaCompartida.estado = 0;

      return await this.TarjetascompartidasRepository.save(tarjetaCompartida);

    } catch (error) {
      return new GenericResponse('500', `Error al eliminar`, error);
    }

  }
}
