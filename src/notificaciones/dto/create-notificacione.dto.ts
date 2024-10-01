import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class NotificationDto {
  @IsString()
  @IsNotEmpty({ message: 'El campo title es requerido' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'El campo body es requerido' })
  body: string;
}

class DataDto {
  @IsString()
  @IsNotEmpty({ message: 'El campo customDataKey es requerido' })
  customDataKey: string;
}

class PayloadDto {
  @ValidateNested()
  @Type(() => NotificationDto)
  notification: NotificationDto;

  @ValidateNested()
  @Type(() => DataDto)
  data: DataDto;
}

export class CreateNotificacioneDto {
  @IsString()
  @IsNotEmpty({ message: 'El campo token es requerido' })
  tokens: string[];

  @ValidateNested()
  @Type(() => PayloadDto)
  payload: PayloadDto;
}