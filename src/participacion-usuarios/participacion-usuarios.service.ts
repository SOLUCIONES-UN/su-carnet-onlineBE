import { Injectable } from '@nestjs/common';
import { CreateParticipacionUsuarioDto } from './dto/create-participacion-usuario.dto';
import { UpdateParticipacionUsuarioDto } from './dto/update-participacion-usuario.dto';

@Injectable()
export class ParticipacionUsuariosService {
  create(createParticipacionUsuarioDto: CreateParticipacionUsuarioDto) {
    return 'This action adds a new participacionUsuario';
  }

  findAll() {
    return `This action returns all participacionUsuarios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} participacionUsuario`;
  }

  update(id: number, updateParticipacionUsuarioDto: UpdateParticipacionUsuarioDto) {
    return `This action updates a #${id} participacionUsuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} participacionUsuario`;
  }
}
