import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class SyncUserDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsOptional()
  username?: string;
}
