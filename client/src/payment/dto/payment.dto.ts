import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';

export class PaymentDto {
  @IsString({ each: true })
  @IsObject()
  amount: {
    value: string;
    currency: string;
  };

  @IsBoolean()
  @IsOptional()
  capture?: boolean;

  @IsString({
    each: true,
  })
  @IsObject()
  @IsOptional()
  confirmation?: {
    type: string;
    return_url: string;
  };

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  metadata: {
    user_id: number;
    date: number;
    userName?: string;
    name: string;
  };
}
