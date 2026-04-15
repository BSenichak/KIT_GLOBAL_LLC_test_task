import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDateString, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskStatus } from '../entities/task.entity';

class LocationDto {
  @ApiProperty({ example: 'Point' })
  @IsString()
  type!: string;

  @ApiProperty({ example: [37.7749, -122.4194] })
  @IsArray()
  coordinates!: number[];
}

export class CreateTaskDto {
  @ApiProperty({ example: 'Fix bug' })
  @IsString()
  title!: string;

  @ApiProperty({ example: 'Description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: TaskStatus.TODO, required: false })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty()
  @IsString()
  project!: string;

  @ApiProperty()
  @IsString()
  assignee!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  parentTask?: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ type: LocationDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @ApiProperty({ example: '2025-12-31T23:59:59Z', required: false })
  @IsOptional()
  @IsDateString()
  deadline?: string;
}