import { IsString, IsNotEmpty } from 'class-validator';

export class SubscribeDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
