import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class LoginUserDto {
  
  @IsString()
  @IsNotEmpty()
  user: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}