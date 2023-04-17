import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UserRequestDto {
  @IsNumber()
  extId: number;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  userName?: string;
}
