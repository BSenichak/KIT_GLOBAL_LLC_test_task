import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsHexColor } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ example: 'bug' })
  @IsString()
  name!: string;

  @ApiProperty({ example: '#ff0000', required: false })
  @IsOptional()
  @IsString()
  @IsHexColor()
  color?: string;
}