import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AreasSucursalesDocumentosService } from './areas_sucursales_documentos.service';
import { CreateAreasSucursalesDocumentoDto } from './dto/create-areas_sucursales_documento.dto';
import { UpdateAreasSucursalesDocumentoDto } from './dto/update-areas_sucursales_documento.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('areas-sucursales-documentos')
export class AreasSucursalesDocumentosController {
  constructor(private readonly areasSucursalesDocumentosService: AreasSucursalesDocumentosService) {}

  @Post()
  async create(@Body() createAreasSucursalesDocumentoDto: CreateAreasSucursalesDocumentoDto) {
    return this.areasSucursalesDocumentosService.create(createAreasSucursalesDocumentoDto);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.areasSucursalesDocumentosService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.areasSucursalesDocumentosService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAreasSucursalesDocumentoDto: UpdateAreasSucursalesDocumentoDto) {
    return this.areasSucursalesDocumentosService.update(+id, updateAreasSucursalesDocumentoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.areasSucursalesDocumentosService.remove(+id);
  }
}
