import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateParticipacionUsuarioDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  areaInscrito: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  fechaParticipacion: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  idEvento: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  idUsuario: number;
}
