import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateEmpresasInformacionDto } from './dto/create-empresas_informacion.dto';
import { UpdateEmpresasInformacionDto } from './dto/update-empresas_informacion.dto';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Vendedores } from '../entities/Vendedores';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { UsuariosRelacionEmpresas } from '../entities/UsuariosRelacionEmpresas';
import { Usuarios } from '../entities/Usuarios';
import { RegistroAfiliaciones } from '../entities/RegistroAfiliaciones';

@Injectable()
export class EmpresasInformacionService {

  private readonly logger = new Logger("EmpresasInformacionService");

  constructor(
    @InjectRepository(EmpresasInformacion)
    private empresaRepository: Repository<EmpresasInformacion>,

    @InjectRepository(Vendedores)
    private vendedoresRepository: Repository<Vendedores>,

    @InjectRepository(Usuarios)
    private UsuariosRepository: Repository<Usuarios>,

    @InjectRepository(RegistroAfiliaciones)
    private RegistroAfiliacionesRepository: Repository<RegistroAfiliaciones>,

  ) { }

  // Función para transformar la fecha
  transformDate(dateString: string): string {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  }

  async create(createEmpresasInformacionDto: CreateEmpresasInformacionDto) {

    try {

      const { idVendedor, ...infoData } = createEmpresasInformacionDto;

      const vendedor = await this.vendedoresRepository.findOneBy({ id: idVendedor });

      if (!vendedor) {
        throw new NotFoundException(`Vendedor con ID ${idVendedor} no encontrado`);
      }

      const empresa = this.empresaRepository.create({
        ...infoData,
        idVendedor: vendedor,
        fechaInicio: new Date().toISOString().split('T')[0]
      });

      await this.empresaRepository.save(empresa);

      return empresa;

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async comerciosFrecuentes() {

    const empresas = await this.empresaRepository
      .createQueryBuilder('empresa')
      .leftJoin('empresa.registroAfiliaciones', 'registroAfiliaciones')
      .where('empresa.estado = :estado', { estado: 1 })
      .groupBy('empresa.id')
      .orderBy('COUNT(registroAfiliaciones.id)', 'DESC')
      .addOrderBy('empresa.nombre', 'ASC')
      .select([
        'empresa.id AS id',
        'empresa.nombre AS nombre',
        'empresa.disclaimer AS disclaimer',
        'empresa.sitioWeb AS sitioWeb',
        'empresa.logotipo AS logotipo',
        'empresa.terminosCondiciones AS terminosCondiciones',
        'COUNT(registroAfiliaciones.id) AS cantidadAfiliaciones', // Contar afiliaciones
      ])
      .limit(5)
      .getRawMany();

    return empresas;
  }


  async findAll(PaginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = PaginationDto;

    const empresas = await this.empresaRepository.find({
      where: { estado: 1 },
      skip: offset,
      take: limit,
      relations: ['empresasDocumentos.idTipoDocumento', 'idVendedor'],
      order: {
        nombre: 'ASC', // Reemplaza 'nombre' con el campo que deseas ordenar alfabéticamente
      },
    });

    return empresas;
  }

  async findAllUser(idUsuario: number) {

    const empresas = await this.empresaRepository.find({
      where: { estado: 1 },
      relations: ['empresasDocumentos.idTipoDocumento', 'idVendedor'],
      order: {
        nombre: 'ASC',
      },
    });

    const usuario = await this.UsuariosRepository.findOneBy({id: idUsuario});

    if(!usuario){
      throw new NotFoundException(`Usuario con ID ${idUsuario} no encontrado`);
    }

    // Iterar sobre las empresas y verificar si el usuario está afiliado
    const empresasConAfiliacion = await Promise.all(empresas.map(async (empresa) => {

      const comercio = await this.empresaRepository.findOneBy({id: empresa.id});

      const afiliacion = await this.RegistroAfiliacionesRepository.findOne({
        where: {
          idUsuario: usuario,
          idEmpresa: comercio,
        },
      });

      return {
        ...empresa,
        usuarioAfiliado: afiliacion ? 1 : 0,
      };
    }));

    return empresasConAfiliacion;
  }


  async GetRecientes() {
    const empresas = await this.empresaRepository.find({
      where: {
        estado: 1,
      },
      order: {
        fechaInicio: 'DESC',
      },
      take: 5, 
      relations: ['empresasDocumentos.idTipoDocumento'],
    });
  
    return empresas;
  }

  async findOne(id: number) {
    return this.empresaRepository.findOneBy({ id });
  }

  async GetEmpresaByDisclaimer(disclaimer: string) {
    return await this.empresaRepository.findOne({
      where: { disclaimer: disclaimer },
    });
  }

  async update(id: number, updateEmpresasInformacionDto: UpdateEmpresasInformacionDto) {

    try {

      const { idVendedor, ...infoData } = updateEmpresasInformacionDto;

      const empresa = await this.empresaRepository.findOneBy({ id });

      if (!empresa) {
        throw new NotFoundException(`Empresa con ID ${id} no encontrado`);
      }

      const vendedor = await this.vendedoresRepository.findOneBy({ id: idVendedor });

      if (!vendedor) {
        throw new NotFoundException(`vendedor con ID ${idVendedor} no encontrado`);
      }

      const updatedEmpresa = this.empresaRepository.merge(empresa, {
        ...infoData,
        idVendedor: vendedor,
      });

      // Guardar los cambios en la base de datos
      await this.empresaRepository.save(updatedEmpresa);

      return updatedEmpresa;

    } catch (error) {
      this.handleDBException(error);
    }

  }

  async remove(id: number) {

    try {

      const empresa = await this.findOne(id);

      if (!empresa) {
        throw new NotFoundException(`empresa con ID ${id} not encontrado`);
      }

      empresa.estado = 0;
      return await this.empresaRepository.save(empresa);

    } catch (error) {
      this.handleDBException(error);
    }
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(`Error : ${error.message}`);
    throw new InternalServerErrorException('Error ');
  }
}
