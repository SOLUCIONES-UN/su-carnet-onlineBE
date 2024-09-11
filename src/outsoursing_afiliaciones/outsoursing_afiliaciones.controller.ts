import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, Put } from '@nestjs/common';
import { OutsoursingAfiliacionesService } from './outsoursing_afiliaciones.service';
import { CreateOutsoursingAfiliacioneDto } from './dto/create-outsoursing_afiliacione.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';

@Controller('outsoursing-afiliaciones')
export class OutsoursingAfiliacionesController {
  constructor(private readonly outsoursingAfiliacionesService: OutsoursingAfiliacionesService) {}

  @Post()
  async create(@Body() createOutsoursingAfiliacioneDto: CreateOutsoursingAfiliacioneDto) {
    return await this.outsoursingAfiliacionesService.create(createOutsoursingAfiliacioneDto);
  }

  @Get()
  async findAll() {
    return await this.outsoursingAfiliacionesService.findAll();
  }

  @Get(':idOutsoursing')
  async findAllByOutsoursingInformacion(@Param('idOutsoursing') idOutsoursing: number) {
    return await this.outsoursingAfiliacionesService.findAllByOutsoursingInformacion(idOutsoursing);
  }


  @Patch('aceptacion/:id')
  async aceptacion(@Param('id') id: string) {
    return await this.outsoursingAfiliacionesService.aceptacion(+id);
  }
}
