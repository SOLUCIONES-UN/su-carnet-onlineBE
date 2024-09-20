import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { SucursalesInformacionService } from './sucursales_informacion.service';
import { CreateSucursalesInformacionDto } from './dto/create-sucursales_informacion.dto';
import { UpdateSucursalesInformacionDto } from './dto/update-sucursales_informacion.dto';

@Controller('sucursales-informacion')
export class SucursalesInformacionController {
  constructor(private readonly sucursalesInformacionService: SucursalesInformacionService) {}

  @Post()
  async create(@Body() createSucursalesInformacionDto: CreateSucursalesInformacionDto) {
    
    return await this.sucursalesInformacionService.create(createSucursalesInformacionDto);
  }

  @Get()
  async findAll() {

   return await this.sucursalesInformacionService.findAll();
  }

  @Get('sucursales/:idEmpresa')
  async findAllByEmpresaId(@Param('idEmpresa') idEmpresa:string) {

    return await this.sucursalesInformacionService.findAllByEmpresaId(+idEmpresa);
  }
  

  @Get(':id')
  async findOne(@Param('id') id: string) {

   return  await this.sucursalesInformacionService.findOne(+id);
  }


  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSucursalesInformacionDto: UpdateSucursalesInformacionDto) {
    
    return await this.sucursalesInformacionService.update(+id, updateSucursalesInformacionDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {

    return await this.sucursalesInformacionService.remove(+id);
  }
  
}
