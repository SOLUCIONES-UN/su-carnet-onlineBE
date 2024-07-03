import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MembresiaInformacionService } from './membresia_informacion.service';
import { CreateMembresiaInformacionDto } from './dto/create-membresia_informacion.dto';
import { UpdateMembresiaInformacionDto } from './dto/update-membresia_informacion.dto';

@Controller('membresia-informacion')
export class MembresiaInformacionController {
  constructor(private readonly membresiaInformacionService: MembresiaInformacionService) {}

  @Post()
  create(@Body() createMembresiaInformacionDto: CreateMembresiaInformacionDto) {
    return this.membresiaInformacionService.create(createMembresiaInformacionDto);
  }

  @Get()
  findAll() {
    return this.membresiaInformacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membresiaInformacionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMembresiaInformacionDto: UpdateMembresiaInformacionDto) {
    return this.membresiaInformacionService.update(+id, updateMembresiaInformacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membresiaInformacionService.remove(+id);
  }
}
