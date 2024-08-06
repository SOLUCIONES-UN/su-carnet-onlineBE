import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { ReporteCitasDto } from './dto/reporte-citas.dto';

@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}


  @Post('ReporteCitas')
  async getReporte(@Body() reporteCita:ReporteCitasDto) {

    if(reporteCita.identificadorReport=== '9488'){
      return await this.reportesService.citasByfecha(reporteCita);

    }else if(reporteCita.identificadorReport === '2842'){
      return await this.reportesService.reporteResumenCitasFechas(reporteCita);
    }
  }

}
