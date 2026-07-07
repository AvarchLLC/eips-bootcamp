import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  college?: string;

  @IsInt()
  @IsOptional()
  year?: number;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  bio?: string;
}
