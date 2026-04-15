import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsHexColor } from 'class-validator';

export class UpdateTagDto {
  @ApiProperty({ example: 'enhancement', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: '#00ff00', required: false })
  @IsOptional()
  @IsString()
  @IsHexColor()
  color?: string;
}