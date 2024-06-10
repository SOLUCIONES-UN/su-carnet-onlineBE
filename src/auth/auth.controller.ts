import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { Usuarios } from '../entities/Usuarios';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { Auth } from './decorators';
import { GenerateToken } from './dto/generateToken.dto';
import { GenericResponse } from '../common/dtos/genericResponse.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('TestPrivateRoute')
  @Auth('admin')
  
  findAll(
    @GetUser() user : Usuarios,
  ) {
    return user;
  }

  @Post('generateNewToken/:accessKey')
  async generateNewToken(@Body() generateNewToken: GenerateToken, @Param('accessKey') accessKey: string) {
    try {
      const user = await this.authService.exisUser(generateNewToken.email);

      if (!user) return new GenericResponse('400', 'Usuario no encontrado', user);

      const result = await this.authService.newToken(generateNewToken.email, accessKey);

      if (result == "error") return new GenericResponse('400', 'La key no es correcta', result);

      return new GenericResponse('200', 'ÉXITO', result);

    } catch (error) {
      throw new HttpException(
        new GenericResponse('500', 'Error al agregar', error),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }


  @Post('login')
  loginUSer( @Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }


}
