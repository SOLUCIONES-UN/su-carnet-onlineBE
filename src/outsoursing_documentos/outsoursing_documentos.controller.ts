import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query } from '@nestjs/common';
import { OutsoursingDocumentosService } from './outsoursing_documentos.service';
import { CreateOutsoursingDocumentoDto } from './dto/create-outsoursing_documento.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('outsoursing-documentos')
export class OutsoursingDocumentosController {
  constructor(private readonly outsoursingDocumentosService: OutsoursingDocumentosService) {}

  @Post()
  async create(@Body() createOutsoursingDocumentoDto: CreateOutsoursingDocumentoDto) {
    
    try {

      const result = await this.outsoursingDocumentosService.create(createOutsoursingDocumentoDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al agregar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {

    try {

      const result = await this.outsoursingDocumentosService.findAll(paginationDto);
      return new GenericResponse('200', 'EXITO', result);

    } catch (error) {
      throw new HttpException(new GenericResponse('500', 'Error al consultar', error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
