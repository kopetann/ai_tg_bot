import { IsString, MaxLength } from 'class-validator';

export class UserChatRequestDto {
  @IsString()
  @MaxLength(1000)
  text: string;
}
