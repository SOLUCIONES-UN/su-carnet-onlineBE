import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateRegistroDispositivoDto } from './dto/create-registro_dispositivo.dto';
import { RegistroDispositivos } from '../entities/RegistroDispositivos';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegistroInformacion } from '../entities/RegistroInformacion';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { Usuarios } from '../entities/Usuarios';

@Injectable()
export class RegistroDispositivosService {

  private readonly logger = new Logger("RegistroDispositivosService");

  constructor(
    @InjectRepository(RegistroDispositivos)
    private RegistroDispositivosRepository: Repository<RegistroDispositivos>,

    @InjectRepository(RegistroInformacion)
    private RegistroInformacionRepository: Repository<RegistroInformacion>,

    @InjectRepository(Usuarios)
    private UsuariosRepository: Repository<Usuarios>

  ) { }

  async create(createRegistroDispositivoDto: CreateRegistroDispositivoDto) {
    
    try {
      const { idUsuario, ...infoData } = createRegistroDispositivoDto;

      const usuario = await this.UsuariosRepository.findOneBy({id:idUsuario});

      if(!usuario) return new GenericResponse('401', `usuario con id ${idUsuario} no existe `, []); 

      const registro_informacion = await this.RegistroInformacionRepository.findOneBy({ idUsuario: usuario });

      if (!registro_informacion) return new GenericResponse('401', `registro_informacion con usuario ${usuario} no existe `, []); 

      const RegistroDispositivos = this.RegistroDispositivosRepository.create({
        ...infoData,
        idRegistroInformacion: registro_informacion,
        fechaUltimoUso: new Date,
        estado: 'ACT'
      });

      await this.RegistroDispositivosRepository.save(RegistroDispositivos);

      return new GenericResponse('200', `EXITO`, RegistroDispositivos);

    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async VerificarDispositivo(idDispositivo: string){

    try {
      
      const dispositivoActivo = await this.RegistroDispositivosRepository.findOne({
        where:{idDispositivo:idDispositivo, estado:'ACT'}
      });

      if(dispositivoActivo) return new GenericResponse('200', `Dispositivo ya existe y esta activo`, []);

      const existeDispositivo = await this.RegistroDispositivosRepository.findOneBy({idDispositivo:idDispositivo});

      if(existeDispositivo) return new GenericResponse('409', `Dispositivo ya existe pero esta inactivo`, []);

      return new GenericResponse('404', `Dispositivo no existe`, []);

    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async findAll() {

    try {

      const RegistroDispositivos = await this.RegistroDispositivosRepository.find({
        relations: ['idRegistroInformacion.idUsuario'],
      });

      return new GenericResponse('200', `EXITO`, RegistroDispositivos);

    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async findAllByUser(idUsuario:number) {

    try {

      const usuario = await this.UsuariosRepository.findOneBy({id:idUsuario});

      if(!usuario) return new GenericResponse('400', `No existe usuario con id ${idUsuario}  `, usuario);

      const registroInformacion = await this.RegistroInformacionRepository.findOneBy({idUsuario:usuario});

      if(!registroInformacion)  return new GenericResponse('400', `No existe registroInforamcion para  el usuario  `, usuario);

      const RegistroDispositivos = await this.RegistroDispositivosRepository.find({
        where:{idRegistroInformacion: registroInformacion},
        relations: ['idRegistroInformacion.idUsuario'],
      });

      return new GenericResponse('200', `EXITO`, RegistroDispositivos);

    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async DispositivoEnvio(id: number) {
   
    try {

      const RegistroDispositivos = await this.RegistroDispositivosRepository.findOneBy({ id });

      if (!RegistroDispositivos) return new GenericResponse('401', `RegistroDispositivos con id ${id} no econtrado `, []); 

      RegistroDispositivos.estado = 'ENV';
      await this.RegistroDispositivosRepository.save(RegistroDispositivos);

      return new GenericResponse('200', `EXITO`, RegistroDispositivos);

    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

  async remove(id: number) {
    
    try {
      
      const RegistroDispositivos = await this.RegistroDispositivosRepository.findOne({ where: { id } });

      if(!RegistroDispositivos) return new GenericResponse('400', `RegistroDispositivos con id ${id} no contrado `, []);
      await this.RegistroDispositivosRepository.remove(RegistroDispositivos);

      return new GenericResponse('200', `EXITO`, RegistroDispositivos);

    } catch (error) {
      return new GenericResponse('500', `Error`, error);
    }
  }

}
