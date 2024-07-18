import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class LoginUserDto {
  
  @IsString()
  @IsNotEmpty()
  user: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  codigoEmpresa: string;
}