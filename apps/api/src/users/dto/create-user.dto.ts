import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  walletAddress?: string;
}
