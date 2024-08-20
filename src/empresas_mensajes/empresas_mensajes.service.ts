import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateEmpresasMensajeDto } from './dto/create-empresas_mensaje.dto';
import { EmpresasMensajes } from '../entities/EmpresasMensajes';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { UpdateEmpresasMensajeDto } from './dto/update-empresas_mensaje.dto';

@Injectable()
export class EmpresasMensajesService {

  private readonly logger = new Logger("EmpresasMensajesService");

  constructor(

    @InjectRepository(EmpresasMensajes)
    private EmpresasMensajesRepository: Repository<EmpresasMensajes>,

    @InjectRepository(EmpresasInformacion)
    private EmpresasInformacionRepository: Repository<EmpresasInformacion>,

  ) { }

  async create(createEmpresasMensajeDto: CreateEmpresasMensajeDto) {
    
    try {
      const { idEmpresa, titulo, contenido, ...infoData } = createEmpresasMensajeDto;

      const EmpresasInformacion = await this.EmpresasInformacionRepository.findOneBy({ id: idEmpresa });

      if (!EmpresasInformacion) {
        throw new NotFoundException(`EmpresasInformacion con ID ${idEmpresa} no encontrada`);
      }

      const empresas_mensaje = this.EmpresasMensajesRepository.create({
        ...infoData,
        fechaHoraEnvio: new Date,
        estado: 'ACT',
        titulo: createEmpresasMensajeDto.titulo,
        accion: createEmpresasMensajeDto.accion,
        contenido: createEmpresasMensajeDto.contenido,
        idEmpresa: EmpresasInformacion
      });

      await this.EmpresasMensajesRepository.save(empresas_mensaje);

      return empresas_mensaje;

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async update(id: number, updateEmpresasMensajeDto: UpdateEmpresasMensajeDto){

    try {

      const {idEmpresa, ...infoData} = updateEmpresasMensajeDto;

      const empresas_mensaje = await this.EmpresasMensajesRepository.findOneBy({id:id});

      if(!empresas_mensaje) return new GenericResponse('401', `Mensaje de empresa con id ${id} no existe`, null);

      const empresa = await this.EmpresasInformacionRepository.findOneBy({id:idEmpresa});

      if(!empresa) return new GenericResponse('401', `Empresa con id ${idEmpresa} no existe`, null);
  
      const updated_MensajeEmpresa = this.EmpresasMensajesRepository.merge(empresas_mensaje, {
        ...infoData,
        estado: 'ACT',
        idEmpresa: empresa
      });
  
      await this.EmpresasMensajesRepository.save(updated_MensajeEmpresa);
  
      return new GenericResponse('200', `EXITO`, updated_MensajeEmpresa);
  
    } catch (error) {
      return new GenericResponse('500', `Error al editar`, error);
    }
  }


  async remove(id: number) {

    try {

      const mensajesEmpresa = await this.EmpresasMensajesRepository.findOneBy({id:id});

      if (!mensajesEmpresa) return new GenericResponse('401', `EmpresaMensaje con id ${id} no existe`, null);

      mensajesEmpresa.estado = 'INA';

      return await this.EmpresasMensajesRepository.save(mensajesEmpresa);

    } catch (error) {
      return new GenericResponse('500', `Error al eliminar`, error);
    }

  }


  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const empresas_mensajes = await this.EmpresasMensajesRepository.find({
      skip: offset,
      take: limit,
      where: {estado: 'ACT'},
      relations: ['idEmpresa'],
    });

    return empresas_mensajes;
  }


  async mensajesEmpresa(idEmpresa: number){

    try {
      
      const empresa = await this.EmpresasInformacionRepository.findOneBy({id:idEmpresa});

      const empresas_mensajes = await this.EmpresasMensajesRepository.find({
        where: {idEmpresa:empresa}
      })

      return new GenericResponse('200', `ÉXITO`, empresas_mensajes);
      
    } catch (error) {
      return new GenericResponse('500', `Error al consultar`, error);
    }
  }


  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(`Error : ${error.message}`);
    throw new InternalServerErrorException('Error ');
  }

}
