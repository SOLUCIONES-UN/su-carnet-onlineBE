import { Injectable, Logger } from '@nestjs/common';
import { CreateFormularioDto } from './dto/create-formulario.dto';
import { UpdateFormularioDto } from './dto/update-formulario.dto';
import { Formularios } from '../entities/Formularios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class FormulariosService {

  constructor(

    @InjectRepository(Formularios)
    private FormulariosRepository: Repository<Formularios>,
  )
  { }
  
  async create(createFormularioDto: CreateFormularioDto) {  

    try {

      let identificador: string;
  
      do {
        identificador = this.generateRandomCode();
      } while (await this.FormulariosRepository.findOneBy({ identificador }));
  
      const formulario = this.FormulariosRepository.create(createFormularioDto);
      formulario.identificador = identificador;
  
      await this.FormulariosRepository.save(formulario);
  
      return new GenericResponse('200', `EXITO`, formulario);
    } catch (error) {
      return new GenericResponse('500', `Error interno al agregar`, error);
    }
  }

  public generateRandomCode(): string {

    let codeVerification = '';

    for (let i = 0; i < 4; i++) {
      const randomDigit = Math.floor(Math.random() * 9) + 1;
      codeVerification += randomDigit.toString();
    }
    return codeVerification;
  }

  async findAll(PaginationDto: PaginationDto) {
   
    try {
      const { limit = 10, offset = 0 } = PaginationDto;

      const formularios = await this.FormulariosRepository.find({
        where: { estado: 1 },
        skip: offset,
        take: limit,
      });
      
      return new GenericResponse('200', `EXITO `, formularios );

    } catch (error) {
      return new GenericResponse('500', `Error al consultar `, error );
    }
  }

  async findOne(id: number) {
    return this.FormulariosRepository.findOneBy({ id });
  }

  async update(id: number, updateFormularioDto: UpdateFormularioDto) {
    
    try {

      const formulario = await this.FormulariosRepository.findOneBy({ id });
      if (!formulario) {
        return new GenericResponse('400', `formulario con id ${id} no encontrado `, null );
      }
  
      Object.assign(formulario, updateFormularioDto);
  
      // Guardar los cambios
      await this.FormulariosRepository.save(formulario);
  
      return new GenericResponse('200', `EXITO`, formulario);

    } catch (error) {
      return new GenericResponse('500', `Error interno al editar `, error );
    }
  }

  async remove(id: number) {
    try {

      const formulario = await this.FormulariosRepository.findOneBy({id});

      if (!formulario) {
        return new GenericResponse('400', `formulario con id ${id} no encontrado `, null );
      }

      formulario.estado = 0;
      await this.FormulariosRepository.save(formulario);

      return new GenericResponse('200', `EXITO`, formulario );

    } catch (error) {
      return new GenericResponse('500', `Error interno al eliminar `, error );
    }
  }
}
