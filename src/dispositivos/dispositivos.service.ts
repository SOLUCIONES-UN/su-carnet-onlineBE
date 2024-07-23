import { Injectable, Logger } from '@nestjs/common';
import { CreateDispositivoDto } from './dto/create-dispositivo.dto';
import { Dispositivos } from '../entities/Dispositivos';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuarios } from '../entities/Usuarios';
import { GenericResponse } from '../common/dtos/genericResponse.dto';

@Injectable()
export class DispositivosService {

  private readonly logger = new Logger("DispositivosService");

  constructor(

    @InjectRepository(Dispositivos)
    private DispositivosRepository: Repository<Dispositivos>,

    @InjectRepository(Usuarios)
    private UsuariosRepository: Repository<Usuarios>,

  ) { }


  async create(createDispositivoDto: CreateDispositivoDto) {

    try {

      const usuario = await this.UsuariosRepository.findOneBy({ id: createDispositivoDto.idusuario });
  
      if (!usuario) {
        return new GenericResponse('400', `El usuario con Id ${createDispositivoDto.idusuario} no encontrado`, null);
      }
  
      let existDispositivo = await this.DispositivosRepository.findOneBy({ idusuario: usuario });
  
      if (existDispositivo) {

        existDispositivo.tokendispositivo = createDispositivoDto.tokendispositivo;
        await this.DispositivosRepository.save(existDispositivo);
        return new GenericResponse('200', `Dispositivo actualizado con éxito`, existDispositivo);
        
      } else {
        const dispositivos = this.DispositivosRepository.create({
          idusuario: usuario,
          tokendispositivo: createDispositivoDto.tokendispositivo
        });
        await this.DispositivosRepository.save(dispositivos);
        return new GenericResponse('200', `Dispositivo creado con éxito`, dispositivos);
      }
    } catch (error) {
      return new GenericResponse('500', `Error al guardar`, error);
    }
  }

  async remove(idusuario: number) {
    
    try {

      const usuario = await this.UsuariosRepository.findOneBy({id: idusuario});
      const dispositivo = await this.DispositivosRepository.findOneBy({idusuario:usuario});

      await this.DispositivosRepository.remove(dispositivo);

      return new GenericResponse('200', `EXITO`, null);

    } catch (error) {
      return new GenericResponse('500', `Error al eliminar `, error);
    }

  }
}
