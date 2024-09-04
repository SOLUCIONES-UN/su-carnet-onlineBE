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
   return  this.outsoursingDocumentosService.create(createOutsoursingDocumentoDto);
  }

  @Get()
  async findAll() {
    return this.outsoursingDocumentosService.findAll();
  }

  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.outsoursingDocumentosService.remove(+id);
  }

}
