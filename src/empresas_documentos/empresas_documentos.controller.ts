import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { EmpresasDocumentosService } from './empresas_documentos.service';
import { CreateEmpresasDocumentoDto } from './dto/create-empresas_documento.dto';

@Controller('empresas-documentos')
export class EmpresasDocumentosController {
  constructor(private readonly empresasDocumentosService: EmpresasDocumentosService) {}

  @Post()
  async create(@Body() createEmpresasDocumentoDto: CreateEmpresasDocumentoDto) {
    
    return await this.empresasDocumentosService.create(createEmpresasDocumentoDto);
  }

  @Get()
  async findAll() {
    return await this.empresasDocumentosService.findAll();
  }

  @Get('findAllByEmpresa/:idEmpresa')
  async findAllByEmpresa(@Param('idEmpresa', ParseIntPipe) idEmpresa: number) {
    return await this.empresasDocumentosService.findAllByEmpresa(idEmpresa);
  }
 
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.empresasDocumentosService.remove(+id);

  }
}
