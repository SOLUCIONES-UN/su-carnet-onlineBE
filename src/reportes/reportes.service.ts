import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ReportesService {

  
  async generateExcelReport(): Promise<string> {

    const sampleData = [
      { id: 1, name: 'Alice Smith', email: 'alice.smith@example.com' },
      { id: 2, name: 'Bob Johnson', email: 'bob.johnson@example.com' },
      { id: 3, name: 'Carol Williams', email: 'carol.williams@example.com' },
      { id: 4, name: 'David Brown', email: 'david.brown@example.com' },
      { id: 5, name: 'Eve Davis', email: 'eve.davis@example.com' },
      { id: 6, name: 'Frank Miller', email: 'frank.miller@example.com' },
      { id: 7, name: 'Grace Wilson', email: 'grace.wilson@example.com' },
      { id: 8, name: 'Hank Moore', email: 'hank.moore@example.com' },
      { id: 9, name: 'Ivy Taylor', email: 'ivy.taylor@example.com' },
      { id: 10, name: 'Jack Anderson', email: 'jack.anderson@example.com' },
    ];

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');

    // Agrega las columnas
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
    ];

    // Agrega las filas
    sampleData.forEach(item => {
      worksheet.addRow(item);
    });

    // Define el directorio y el archivo
    const reportsDir = path.join(__dirname, '..', '..', 'reports');
    const filePath = path.join(reportsDir, 'report.xlsx');

    // Crea el directorio si no existe
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Guarda el archivo en el sistema
    await workbook.xlsx.writeFile(filePath);

    return filePath;
  }


  findAll() {
    return `This action returns all reportes`;
  }

}
