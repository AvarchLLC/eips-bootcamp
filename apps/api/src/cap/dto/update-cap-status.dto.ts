import { IsIn, IsNotEmpty } from 'class-validator';

export class UpdateCapStatusDto {
  @IsNotEmpty()
  @IsIn(['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'])
  status!: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
}
