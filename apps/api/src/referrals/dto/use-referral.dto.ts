import { IsString, IsNotEmpty } from 'class-validator';

export class UseReferralDto {
  @IsString()
  @IsNotEmpty()
  referralCode!: string;

  @IsString()
  @IsNotEmpty()
  referredUserId!: string;
}
