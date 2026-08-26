import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class AwardXpDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
