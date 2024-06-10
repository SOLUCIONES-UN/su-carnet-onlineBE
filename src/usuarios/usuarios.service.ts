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

@Injectable()
export class UsuariosService {

  private readonly logger = new Logger("UsuarioService");

  constructor(
    @InjectRepository(Usuarios)
    private usuariosRepository: Repository<Usuarios>,

    @InjectRepository(TipoUsuario)
    private tipos_usuariosRepository: Repository<TipoUsuario>,

  ) { }

  async create(createUsuarioDto: CreateUsuarioDto) {

    try {

      const { password, idTipo, ...userInfo } = createUsuarioDto;

      // Buscando la relación TipoUsuario 
      const tipoUsuario = await this.tipos_usuariosRepository.findOneBy({ id: idTipo });

      if (!tipoUsuario) {
        throw new NotFoundException(`TipoUsuario con ID ${idTipo} no contrado`);
      }

      // Generar la passwordSalt
      const passwordSalt = bcrypt.genSaltSync(10);

      // Hashear la contraseña con passwordSalt generada
      const passwordHash = bcrypt.hashSync(password, passwordSalt);

      // Convertir hash y sal a Buffer
      const passwordHashBuffer = Buffer.from(passwordHash, 'utf-8');
      const saltBuffer = Buffer.from(passwordSalt, 'utf-8');

      const usuario = this.usuariosRepository.create({
        ...userInfo,
        passwordhash: passwordHashBuffer,
        passwordsalt: saltBuffer,
        idTipo: tipoUsuario, // Asignar la relación
      });

      await this.usuariosRepository.save(usuario);

      return createUsuarioDto;

    } catch (error) {
      this.handleDBException(error);
    }

  }

  async existsEmail(email: string): Promise<boolean> {
    const count = await this.usuariosRepository.count({ where: { email } });
    return count > 0;
  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 1 } = PaginationDto;

    const users = await this.usuariosRepository.find({
      where: {
        estado: In([1, 2]),
      },
      skip: offset,
      take: limit,
      relations: ['idTipo'],
    });
    return users;
  }

  async findOne(id: number) {
    return this.usuariosRepository.findOne({
      where: { id },
      relations: ['idTipo'],
    });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {

    try {

      const usuario = await this.usuariosRepository.findOneBy({ id });
      if (!usuario) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }
 
      if (updateUsuarioDto.idTipo) {
        const tipoUsuario = await this.tipos_usuariosRepository.findOneBy({ id: updateUsuarioDto.idTipo });
        if (!tipoUsuario) {
          throw new NotFoundException(`TipoUsuario con ID ${updateUsuarioDto.idTipo} no encontrado`);
        }
        usuario.idTipo = tipoUsuario;
      }

      // Actualizar los demás campos, exceptuando `passwordhash` y `passwordsalt`
      for (const key in updateUsuarioDto) {
        if (updateUsuarioDto.hasOwnProperty(key) && key !== 'idTipo' && key !== 'password') {
          usuario[key] = updateUsuarioDto[key];
        }
      }

      await this.usuariosRepository.save(usuario);

      return updateUsuarioDto;

    } catch (error) {
      this.handleDBException(error);
    }
  }


  async verifiUser(email:string){

    const user = await this.usuariosRepository.findOne({
      where: { email: email, estado: 2 },
    });

    return user;
  }

  async verfiPassword(currentPassword:string, user:Usuarios): Promise<boolean>{

    // Verificar la contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, user.passwordhash.toString());
    if (!isMatch) {
      return false;
    }

    return true;
  }

  async changePassword(changePasswordDto: changePasswordDto): Promise<boolean> {

    try {

      const user = await this.usuariosRepository.findOne({
        where: { email: changePasswordDto.email, estado: 2 },
      });
  
      // Encriptar la nueva contraseña
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(changePasswordDto.newPassword, salt);
  
      // Convertir el hash y el salt en Buffer si es necesario
      const passwordHashBuffer = Buffer.from(hash);
      const passwordSaltBuffer = Buffer.from(salt);
  
      // Actualizar el usuario con la nueva contraseña y el salt
      user.passwordhash = passwordHashBuffer;
      user.passwordsalt = passwordSaltBuffer;
      user.estado = 2; 
  
      await this.usuariosRepository.save(user);
  
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
