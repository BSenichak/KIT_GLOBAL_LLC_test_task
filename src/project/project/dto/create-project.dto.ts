import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'My Project' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'Project description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}