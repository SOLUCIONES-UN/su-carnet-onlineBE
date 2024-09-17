import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query } from '@nestjs/common';
import { OutsoursingDocumentosService } from './outsoursing_documentos.service';
import { CreateOutsoursingDocumentoDto } from './dto/create-outsoursing_documento.dto';

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

  @Get('findAllByEmpresa/:idEmpresa')
  async findAllByEmpresa(@Param('idEmpresa') idEmpresa:number) {
    return this.outsoursingDocumentosService.findAllByEmpresa(idEmpresa);
  }

  @Get(':idOutsoursing')
  async findAllByOutsoursingInformacion(@Param('idOutsoursing') idOutsoursing: number) {
    return this.outsoursingDocumentosService.findAllByOutsoursingInformacion(idOutsoursing);
  }

  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.outsoursingDocumentosService.remove(+id);
  }

}
