import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateAreasEventoDto {
  @IsString()
  @IsNotEmpty()
  nombreArea: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  cupoMaximo: number;

  @IsOptional()
  @IsNumber()
  precio: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  idEmpresa: number;
}
