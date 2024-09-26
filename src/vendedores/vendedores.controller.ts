import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { VendedoresService } from './vendedores.service';
import { CreateVendedoreDto } from './dto/create-vendedore.dto';
import { UpdateVendedoreDto } from './dto/update-vendedore.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('vendedores')
export class VendedoresController {
  constructor(private readonly vendedoresService: VendedoresService) {}

  @Post()
  async create(@Body() createVendedoreDto: CreateVendedoreDto) {
    
    return await this.vendedoresService.create(createVendedoreDto);

  }

  @Get()
  async findAll() {
    
    return await this.vendedoresService.findAll();

  }

  @Get(':id')
  async findOne(@Param('id') id: string) {

    return await this.vendedoresService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateVendedoreDto: UpdateVendedoreDto) {
    
    return await this.vendedoresService.update(+id, updateVendedoreDto);

  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {

    return await this.vendedoresService.remove(+id);

  }
  
}
