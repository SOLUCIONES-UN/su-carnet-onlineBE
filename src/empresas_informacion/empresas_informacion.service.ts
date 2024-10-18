import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateEmpresasInformacionDto } from './dto/create-empresas_informacion.dto';
import { UpdateEmpresasInformacionDto } from './dto/update-empresas_informacion.dto';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Vendedores } from '../entities/Vendedores';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Usuarios } from '../entities/Usuarios';
import { RegistroAfiliaciones } from '../entities/RegistroAfiliaciones';
import { Tiposcuentas } from '../entities/Tiposcuentas';

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

    @InjectRepository(Tiposcuentas)
    private TiposcuentasRepository: Repository<Tiposcuentas>,

  ) { }

  // Función para transformar la fecha
  transformDate(dateString: string): string {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  }


  public generateRandomCode(): string {

    let empresaCode = '';

    for (let i = 0; i < 4; i++) {
      const randomDigit = Math.floor(Math.random() * 9) + 1;
      empresaCode += randomDigit.toString();
    }
    return empresaCode;
  }

  async create(createEmpresasInformacionDto: CreateEmpresasInformacionDto) {

    try {

      let codigoEmpresa : string;

      const { idVendedor, ...infoData } = createEmpresasInformacionDto;

      const vendedor = await this.vendedoresRepository.findOneBy({ id: idVendedor });

      const tipoCuenta = await this.TiposcuentasRepository.findOneBy({id: createEmpresasInformacionDto.tipoCuenta});

      codigoEmpresa = this.generateRandomCode();

      const existeCodigo = await this.empresaRepository.findOneBy({codigoEmpresa: codigoEmpresa});

      if(existeCodigo){
        codigoEmpresa = this.generateRandomCode();
      }

      const empresa = this.empresaRepository.create({
        ...infoData,
        idVendedor: vendedor,
        codigoEmpresa: codigoEmpresa,
        tipoCuenta: tipoCuenta,
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


  async empresaByCode(codigo: string){

    return await this.empresaRepository.findOneBy({codigoEmpresa: codigo});
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


  async GetRecientes(idUsuario: number) {

    const empresas = await this.empresaRepository.find({
      where: {
        estado: 1,
      },
      order: {
        fechaInicio: 'DESC',
        nombre: 'ASC',
      },
      take: 5, 
      relations: ['empresasDocumentos.idTipoDocumento'],
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
          estado: 'ACEP'
        },
      });

      return {
        ...empresa,
        usuarioAfiliado: afiliacion ? 1 : 0,
      };
    }));

    return empresasConAfiliacion;
  }

  async findOne(id: number) {
    return this.empresaRepository.findOne({
      where: {id: id},
      relations: ['empresasDocumentos.idTipoDocumento']
    })
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

      const tipoCuenta = await this.TiposcuentasRepository.findOneBy({id: updateEmpresasInformacionDto.tipoCuenta});

      if (!vendedor) {
        throw new NotFoundException(`vendedor con ID ${idVendedor} no encontrado`);
      }

      const updatedEmpresa = this.empresaRepository.merge(empresa, {
        ...infoData,
        idVendedor: vendedor,
        tipoCuenta: tipoCuenta
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
