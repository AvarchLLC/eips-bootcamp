import { IsString, IsNotEmpty } from 'class-validator';

export class GenerateReferralDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  username!: string;
}
