import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class GenerateToken {
  
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
  }