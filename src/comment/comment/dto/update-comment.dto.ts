import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({ example: 'Updated comment' })
  @IsString()
  @IsNotEmpty()
  content!: string;
}