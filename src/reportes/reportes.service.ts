import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import { ReporteCitasDto } from './dto/reporte-citas.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SucursalesAreasInformacion } from '../entities/SucursalesAreasInformacion';
import { SucursalesAreasPermisos } from '../entities/SucursalesAreasPermisos';
import { Between } from 'typeorm';
import { GenericResponse } from '../common/dtos/genericResponse.dto';
import * as sgMail from '@sendgrid/mail';
import { Usuarios } from '../entities/Usuarios';
import { SucursalesAreasGruposInformacion } from '../entities/SucursalesAreasGruposInformacion';

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(SucursalesAreasInformacion)
    private areasInformacionRepository: Repository<SucursalesAreasInformacion>,

    @InjectRepository(SucursalesAreasPermisos)
    private SucursalesAreasPermisosRepository: Repository<SucursalesAreasPermisos>,

    @InjectRepository(SucursalesAreasGruposInformacion)
    private SucursalesAreasGruposInformacionRepository: Repository<SucursalesAreasGruposInformacion>,

    @InjectRepository(Usuarios)
    private UsuariosRepository: Repository<Usuarios>,
  ) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendEmail(correoDestino: string, filePath: string): Promise<boolean> {
    const fileContent = fs.readFileSync(filePath).toString('base64');

    const msg = {
      to: correoDestino,
      from: process.env.fromEmail,
      subject: 'Reportes',
      text: 'REPORTE DE CITAS POR FECHA',
      html: '<p>Adjunto encontrarás el reporte solicitado.</p>',
      attachments: [
        {
          content: fileContent,
          filename: path.basename(filePath),
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          disposition: 'attachment',
        },
      ],
    };

    try {
      await sgMail.send(msg);
      console.log('Email sent');
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      if (error.response) {
        console.error('Response body:', error.response.body);
      }
      return false;
    }
  }

  async reporteResumenCitasFechas(reporteCita: ReporteCitasDto) {
    
    const areaSucursal = await this.areasInformacionRepository.findOneBy({
      id: reporteCita.idAreaSucursal,
    });

    if (!areaSucursal) {
      return new GenericResponse('404', `Area no encontrada`, null);
    }

    const usuario = await this.UsuariosRepository.findOneBy({
      id: reporteCita.idUsuario,
    });

    if (!usuario) {
      return new GenericResponse('404', `Usuario no encontrado`, []);
    }

    const cita = await this.SucursalesAreasPermisosRepository.findOne({ 
      where: {idAreaGrupo: areaSucursal.sucursalesAreasGruposInformacions},
      relations: ['idAreaGrupo']
    });

    const reporteCitas = await this.SucursalesAreasPermisosRepository.createQueryBuilder('sap')
      .select('sap.estado', 'estado')
      .addSelect('sap.fecha', 'fecha')
      .addSelect('COUNT(sap.id)', 'cantidad')
      .where('sap.idAreaGrupo = :idAreaGrupo', { idAreaGrupo: cita.idAreaGrupo.id })
      .andWhere('sap.fecha BETWEEN :fechaInicio AND :fechaFinal', { fechaInicio: reporteCita.fechaInicio, fechaFinal: reporteCita.fechaFinal })
      .groupBy('sap.estado, sap.fecha')
      .getRawMany();

      const formattedReporteCitas = reporteCitas.map(cita => ({
        ...cita,
        fecha: cita.fecha.toISOString().split('T')[0], // Formatear la fecha
      }));

      const filePath = await this.generateExcelReportResumenFechas(formattedReporteCitas);

      await this.sendEmail(usuario.email, filePath);

    return new GenericResponse('200', `Reporte Generado con exito`, null);
  }

  
  async citasByfecha(reporteCita: ReporteCitasDto) {

    const areaSucursal = await this.areasInformacionRepository.findOneBy({
      id: reporteCita.idAreaSucursal,
    });

    const usuario = await this.UsuariosRepository.findOneBy({
      id: reporteCita.idUsuario,
    });

    const reporteCitas = await this.SucursalesAreasPermisosRepository.find({
      where: {
        idAreaGrupo: areaSucursal.sucursalesAreasGruposInformacions,
        fecha: Between(reporteCita.fechaInicio, reporteCita.fechaFinal),
      },
      relations: ['idAreaGrupo', 'idAreaGrupo.idSucursalArea'],
    });

    const filePath = await this.generateExcelReportcitasByfecha(reporteCitas);

    await this.sendEmail(usuario.email, filePath);

    return new GenericResponse('200', `Reporte Generado con exito`, null);
  }

  async generateExcelReportcitasByfecha(datareporteCitas: any): Promise<string> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');

    // Agrega las columnas
    worksheet.columns = [
      { header: 'Fecha', key: 'fecha', width: 15 },
      { header: 'Estado', key: 'estado', width: 10 },
      { header: 'Hora Inicio', key: 'horaInicio', width: 15 },
      { header: 'Hora Final', key: 'horaFinal', width: 15 },
      { header: 'Grupo de area ', key: 'idAreaGrupoDescripcion', width: 30 },
      {
        header: 'Area de sucursal ',
        key: 'sucursalAreaDescripcion',
        width: 15,
      },
    ];

    // Agrega las filas
    datareporteCitas.forEach((item) => {
      worksheet.addRow({
        fecha: item.fecha,
        estado: item.estado,
        horaInicio: item.horaInicio,
        horaFinal: item.horaFinal,
        idAreaGrupoDescripcion: item.idAreaGrupo.descripcion,
        sucursalAreaDescripcion: item.idAreaGrupo.idSucursalArea.descripcion,
      });
    });

    // Define el directorio y el archivo
    const reportsDir = path.join(__dirname, '..', '..', 'reportes');
    const filePath = path.join(reportsDir, 'reporte_citas_por_Fecha.xlsx');

    // Crea el directorio si no existe
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Guarda el archivo en el sistema
    await workbook.xlsx.writeFile(filePath);

    return filePath;
  }


  async generateExcelReportResumenFechas(datareporteCitas: any): Promise<string> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');

    // Agrega las columnas
    worksheet.columns = [
      { header: 'Fecha', key: 'fecha', width: 15 },
      { header: 'Estado', key: 'estado', width: 10 },
      { header: 'Cantidad', key: 'cantidad', width: 15 }
    ];

    // Agrega las filas
    datareporteCitas.forEach((item) => {
      worksheet.addRow({
        fecha: item.fecha,
        estado: item.estado,
        cantidad: item.cantidad,
      });
    });

    // Define el directorio y el archivo
    const reportsDir = path.join(__dirname, '..', '..', 'reportes');
    const filePath = path.join(reportsDir, 'resumen_por_fecha.xlsx');

    // Crea el directorio si no existe
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Guarda el archivo en el sistema
    await workbook.xlsx.writeFile(filePath);

    return filePath;
  }
}