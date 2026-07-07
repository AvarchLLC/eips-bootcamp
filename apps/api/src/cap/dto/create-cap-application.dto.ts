import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateCapApplicationDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsString()
  @IsNotEmpty()
  college!: string;

  @IsInt()
  @IsNotEmpty()
  graduationYear!: number;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsOptional()
  socialLinks?: string;

  @IsString()
  @IsNotEmpty()
  whyJoin!: string;

  @IsString()
  @IsOptional()
  communityExperience?: string;
}
