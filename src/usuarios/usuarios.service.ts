import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuarios } from '../entities/Usuarios';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { TipoUsuario } from '../entities/TipoUsuario';
import { changePasswordDto } from './dto/changePasswordDto';
import { EmpresasInformacion } from '../entities/EmpresasInformacion';
import { UsuariosRelacionEmpresas } from '../entities/UsuariosRelacionEmpresas';
import { RegistrarFotoPerfilDto } from './dto/registrarFotoPerfilDto';
import { use } from 'passport';
import { SucursalesInformacion } from '../entities/SucursalesInformacion';
import { SucursalesAreasInformacion } from '../entities/SucursalesAreasInformacion';

@Injectable()
export class UsuariosService {

  private readonly logger = new Logger("UsuarioService");

  constructor(
    @InjectRepository(Usuarios)
    private usuariosRepository: Repository<Usuarios>,

    @InjectRepository(TipoUsuario)
    private tipos_usuariosRepository: Repository<TipoUsuario>,

    @InjectRepository(EmpresasInformacion)
    private EmpresasInformacionRepository: Repository<EmpresasInformacion>,

    @InjectRepository(UsuariosRelacionEmpresas)
    private UsuariosRelacionEmpresasRepository: Repository<UsuariosRelacionEmpresas>,

    @InjectRepository(SucursalesInformacion)
    private SucursalesInformacionRepository: Repository<SucursalesInformacion>,

    @InjectRepository(SucursalesAreasInformacion)
    private SucursalesAreasInformacionRepository: Repository<SucursalesAreasInformacion>,

  ) { }


  async getTipoUsuario() {

    return await this.tipos_usuariosRepository.findOne({ where: { descripcion: 'aplicacion' } });
  }

  async getTipoUsuarioById(idTipo:number){
    return await this.tipos_usuariosRepository.findOneBy({id:idTipo});
  }


  async create(createUsuarioDto: CreateUsuarioDto) {

    try {

      const { password, idTipo, idEmpresas, idSucursal, idAreaSucursal, ...userInfo } = createUsuarioDto;

      let empresa;
      let sucursal;
      let areaSucursal;

      // Validar empresas si existen
      if (idEmpresas !== null && idEmpresas !== undefined) {
        
        empresa = await this.EmpresasInformacionRepository.findOneBy({id:idEmpresas});
        if (!empresa) {
          throw new NotFoundException(`empresa con id ${idEmpresas} no encontrada`);
        }
      }

      if (idSucursal !== null && idSucursal !== undefined) {
        sucursal = await this.SucursalesInformacionRepository.findOneBy({id:idSucursal});

        if (!sucursal) {
          throw new NotFoundException(`sucursal con id ${idSucursal} no encontrada`);
        }
      }

      if (idAreaSucursal !== null && idAreaSucursal !== undefined) {
        areaSucursal = await this.SucursalesAreasInformacionRepository.findOneBy({id:idAreaSucursal});

        if (!areaSucursal) {
          throw new NotFoundException(`area de sucursal con id ${idAreaSucursal} no encontrada`);
        }
      }

      // Buscar la relación TipoUsuario 
      const tipoUsuario = await this.tipos_usuariosRepository.findOne({ where: { id: idTipo } });

      if (!tipoUsuario) {
        throw new NotFoundException(`TipoUsuario con ID ${idTipo} no encontrado`);
      }

      // Generar la passwordSalt
      const passwordSalt = bcrypt.genSaltSync(10);

      // Hashear la contraseña con passwordSalt generada
      const passwordHash = bcrypt.hashSync(password, passwordSalt);

      // Convertir hash y sal a Buffer
      const passwordHashBuffer = Buffer.from(passwordHash, 'utf-8');
      const saltBuffer = Buffer.from(passwordSalt, 'utf-8');

      // Crear el usuario
      const usuario = this.usuariosRepository.create({
        ...userInfo,
        passwordhash: passwordHashBuffer,
        passwordsalt: saltBuffer,
        idTipo: tipoUsuario,
      });

      await this.usuariosRepository.save(usuario);

      // Crear las relaciones entre usuario y empresas si existen
      if (empresa) {
        const UsuariosRelacionEmpresas = this.UsuariosRelacionEmpresasRepository.create({
          idUsuario: usuario,
          idEmpresa: empresa,
          idSucursal: sucursal,
          idAreaSucursal: areaSucursal
        });

        await this.UsuariosRelacionEmpresasRepository.save(UsuariosRelacionEmpresas);
      }

      return usuario;

    } catch (error) {
      this.handleDBException(error);
    }
  }

  // async create(createUsuarioDto: CreateUsuarioDto) {

  //   try {

  //     const { password, idTipo, idEmpresas, idSucursal, idAreaSucursal, ...userInfo } = createUsuarioDto;
  //     let empresas = [];
  //     let sucursales = [];
  //     let areasSucursal = [];

  //     // Validar empresas si existen
  //     if (idEmpresas !== null && idEmpresas !== undefined && idEmpresas.length > 0) {
  //       empresas = await this.EmpresasInformacionRepository.findByIds(idEmpresas);

  //       if (empresas.length !== idEmpresas.length) {
  //         throw new NotFoundException(`Una o más empresas no fueron encontradas`);
  //       }
  //     }

  //     if (idSucursal !== null && idSucursal !== undefined && idSucursal.length > 0) {
  //       sucursales = await this.SucursalesInformacionRepository.findByIds(idSucursal);

  //       if (sucursales.length !== idSucursal.length) {
  //         throw new NotFoundException(`Una o más sucursales no fueron encontradas`);
  //       }
  //     }

  //     if (idAreaSucursal !== null && idAreaSucursal !== undefined && idAreaSucursal.length > 0) {
  //       areasSucursal = await this.SucursalesAreasInformacionRepository.findByIds(idAreaSucursal);

  //       if (areasSucursal.length !== idAreaSucursal.length) {
  //         throw new NotFoundException(`Una o más areas de sucursales no fueron encontradas`);
  //       }
  //     }

  //     // Buscar la relación TipoUsuario 
  //     const tipoUsuario = await this.tipos_usuariosRepository.findOne({ where: { id: idTipo } });

  //     if (!tipoUsuario) {
  //       throw new NotFoundException(`TipoUsuario con ID ${idTipo} no encontrado`);
  //     }

  //     // Generar la passwordSalt
  //     const passwordSalt = bcrypt.genSaltSync(10);

  //     // Hashear la contraseña con passwordSalt generada
  //     const passwordHash = bcrypt.hashSync(password, passwordSalt);

  //     // Convertir hash y sal a Buffer
  //     const passwordHashBuffer = Buffer.from(passwordHash, 'utf-8');
  //     const saltBuffer = Buffer.from(passwordSalt, 'utf-8');

  //     // Crear el usuario
  //     const usuario = this.usuariosRepository.create({
  //       ...userInfo,
  //       passwordhash: passwordHashBuffer,
  //       passwordsalt: saltBuffer,
  //       idTipo: tipoUsuario,
  //     });

  //     await this.usuariosRepository.save(usuario);

  //     // Crear las relaciones entre usuario y empresas si existen
  //     if (empresas.length > 0) {
  //       for (const empresa of empresas) {

  //         for (const sucursal of sucursales) {

  //           for (const areaSucursal of areasSucursal) {
  //             const UsuariosRelacionEmpresas = this.UsuariosRelacionEmpresasRepository.create({
  //               idUsuario: usuario,
  //               idEmpresa: empresa,
  //               idSucursal: sucursal,
  //               idAreaSucursal: areaSucursal
  //             });

  //             await this.UsuariosRelacionEmpresasRepository.save(UsuariosRelacionEmpresas);
  //           }
  //         }
  //       }
  //     }

  //     return usuario;

  //   } catch (error) {
  //     this.handleDBException(error);
  //   }
  // }


  async updatePhotoPerfil(user: string, fotoPerfil: string) {

    try {

      let usuario: Usuarios;

      if (this.isEmail(user)) {
        usuario = await this.usuariosRepository.findOne({
          where: { email: user },
        });
      } else if (this.isPhoneNumber(user)) {
        usuario = await this.usuariosRepository.findOne({
          where: { telefono: user },
        });
      }

      if (!usuario) {
        throw new NotFoundException(`Usuario con identificador ${user} no encontrado`);
      }

      const newFoto = usuario.id + "/" + fotoPerfil;

      usuario.fotoPerfil = newFoto;

      return await this.usuariosRepository.save(usuario);

    } catch (error) {
      this.handleDBException(error);
      return false;
    }

  }


  async existsEmail(email: string): Promise<boolean> {
    const count = await this.usuariosRepository.count({ where: { email } });
    return count > 0;
  }

  async existsPhoneNumber(telefono: string): Promise<boolean> {
    const count = await this.usuariosRepository.count({ where: { telefono } });
    return count > 0;
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const users = await this.usuariosRepository.find({
      where: {
        estado: In([1, 2]),
      },
      skip: offset * limit,
      take: limit,
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        email: true,
        telefono: true,
        fotoPerfil: true,
        estado: true
      },
      relations: ['idTipo', 'usuariosRelacionEmpresas', 'usuariosRelacionEmpresas.idEmpresa', 'usuariosRelacionEmpresas.idSucursal', 'usuariosRelacionEmpresas.idAreaSucursal'],
    });

    return users;
  }

  async findOne(id: number) {
    return this.usuariosRepository.findOne({
      where: { id },
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        email: true,
        telefono: true,
        fotoPerfil: true,
        estado: true

      },
      relations: ['idTipo', 'usuariosRelacionEmpresas', 'usuariosRelacionEmpresas.idEmpresa', 'usuariosRelacionEmpresas.idSucursal', 'usuariosRelacionEmpresas.idAreaSucursal'],
    });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {

    try {

      const usuario = await this.usuariosRepository.findOne({ where: { id } });

      if (!usuario) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      if (updateUsuarioDto.idEmpresas && updateUsuarioDto.idEmpresas.length > 0) {

        for (let i = 0; i < updateUsuarioDto.idEmpresas.length; i++) {

          for (let i = 0; i < updateUsuarioDto.idSucursal.length; i++) {

            for (let i = 0; i < updateUsuarioDto.idAreaSucursal.length; i++) {

              const idempresa = updateUsuarioDto.idEmpresas[i];
              const idSucursal = updateUsuarioDto.idSucursal[i];
              const idAreaSucursal = updateUsuarioDto.idAreaSucursal[i];

              const empresa = await this.EmpresasInformacionRepository.findOneBy({ id: idempresa });
              const sucursal = await this.SucursalesInformacionRepository.findOneBy({ id: idSucursal });
              const areaSucursal = await this.SucursalesAreasInformacionRepository.findOneBy({ id: idAreaSucursal});

              const relacionesEncontradas = await this.UsuariosRelacionEmpresasRepository.find({
                where: {
                  idUsuario: usuario,
                  idEmpresa: empresa,
                  // idSucursal: sucursal,
                  // idAreaSucursal: areaSucursal
                },
              });

              let relacionEncontrada: UsuariosRelacionEmpresas | null = null;

              if (relacionesEncontradas.length > 0) {

                relacionEncontrada = relacionesEncontradas[0];
                relacionEncontrada.estado = 1;
                relacionEncontrada.idEmpresa = empresa;
                relacionEncontrada.idSucursal = sucursal;
                relacionEncontrada.idAreaSucursal = areaSucursal;
                
                await this.UsuariosRelacionEmpresasRepository.save(relacionesEncontradas);

              }
              else if (relacionesEncontradas.length === 0) {

                const relacionUsuarioEmpresa = this.UsuariosRelacionEmpresasRepository.create({
                  idEmpresa: empresa,
                  idUsuario: usuario,
                  idSucursal: sucursal,
                  idAreaSucursal: areaSucursal
                });
                await this.UsuariosRelacionEmpresasRepository.save(relacionUsuarioEmpresa);
              }
            }
          }

        }

      } else if (updateUsuarioDto.idEmpresas && updateUsuarioDto.idEmpresas.length === 0) {

        const relacionesEncontradas = await this.UsuariosRelacionEmpresasRepository.find({
          where: {
            idUsuario: usuario
          },
        });

        if (relacionesEncontradas.length > 0) {

          relacionesEncontradas.forEach(async element => {
            element.estado = 0;
            await this.UsuariosRelacionEmpresasRepository.save(element);
          });
        }
      }

      if (updateUsuarioDto.idTipo !== undefined) {
        const tipoUsuario = await this.tipos_usuariosRepository.findOne({ where: { id: updateUsuarioDto.idTipo } });
        if (!tipoUsuario) {
          throw new NotFoundException(`TipoUsuario con ID ${updateUsuarioDto.idTipo} no encontrado`);
        }
        usuario.idTipo = tipoUsuario;
      }

      // Actualizar los demás campos, exceptuando `idTipo`, `password` y `idEmpresas`
      for (const key in updateUsuarioDto) {
        if (updateUsuarioDto.hasOwnProperty(key) && key !== 'idTipo' && key !== 'password' && key !== 'idEmpresas') {
          usuario[key] = updateUsuarioDto[key];
        }
      }

      await this.usuariosRepository.save(usuario);

      return updateUsuarioDto;

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async verifiUser(user: string): Promise<Usuarios> {

    let usuario: Usuarios;

    // Verificar si el campo user es un email o un número de teléfono
    if (this.isEmail(user)) {
      // Buscar usuario por email
      usuario = await this.usuariosRepository.findOne({
        where: { email: user, estado: 2 },
      });
    } else if (this.isPhoneNumber(user)) {
      // Buscar usuario por número de teléfono
      usuario = await this.usuariosRepository.findOne({
        where: { telefono: user, estado: 2 },
      });
    }

    return usuario;
  }

  // Método para verificar si el user es un email válido
  private isEmail(user: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(user);
  }

  // Método para verificar si el user es un número de teléfono válido
  private isPhoneNumber(user: string): boolean {
    const phoneRegex = /^[0-9]{10,15}$/; // Ajusta la expresión regular según el formato de número de teléfono que necesites
    return phoneRegex.test(user);
  }

  async verfiPassword(currentPassword: string, user: Usuarios): Promise<boolean> {

    // Verificar la contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, user.passwordhash.toString());
    if (!isMatch) {
      return false;
    }

    return true;
  }

  async changePassword(changePasswordDto: changePasswordDto, usuario: Usuarios): Promise<boolean> {

    try {

      // Encriptar la nueva contraseña
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(changePasswordDto.newPassword, salt);

      // Convertir el hash y el salt en Buffer si es necesario
      const passwordHashBuffer = Buffer.from(hash);
      const passwordSaltBuffer = Buffer.from(salt);

      // Actualizar el usuario con la nueva contraseña y el salt
      usuario.passwordhash = passwordHashBuffer;
      usuario.passwordsalt = passwordSaltBuffer;
      usuario.estado = 2;

      await this.usuariosRepository.save(usuario);

      return true;

    } catch (error) {
      this.handleDBException(error);
      return false;
    }
  }


  async remove(id: number) {

    try {

      const usuario = await this.usuariosRepository.findOneBy({ id });

      if (!usuario) {
        throw new NotFoundException(`usuario con ID ${id} no encontrado`);
      }

      usuario.estado = 0;

      return await this.usuariosRepository.save(usuario);

    } catch (error) {
      this.handleDBException(error);
    }
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(`Error: ${error.message}`);
    throw new InternalServerErrorException(NotFoundException);
  }
}
