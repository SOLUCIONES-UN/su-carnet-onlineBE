import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { Usuarios } from '../entities/Usuarios';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { Auth } from './decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('TestPrivateRoute')
  @Auth('User')
  
  findAll(
    @GetUser() user : Usuarios,
  ) {


    return user;
  }

  


  @Post('login')
  loginUSer( @Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }


}
