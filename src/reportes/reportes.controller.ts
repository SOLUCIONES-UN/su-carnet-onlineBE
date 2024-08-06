import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { UpdateReporteDto } from './dto/update-reporte.dto';
import { ReporteCitasDto } from './dto/reporte-citas.dto';

@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}


  @Post()
  getReporte(@Body() reporteCita:ReporteCitasDto) {
    return this.reportesService.citasByfecha(reporteCita);
  }


}
