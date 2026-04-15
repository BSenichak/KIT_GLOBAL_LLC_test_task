import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchTaskDto {
  @ApiProperty({ example: 'bug fix', required: false })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiProperty({ example: 'IN_PROGRESS', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: 'tag-id', required: false })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiProperty({ example: 'project-id', required: false })
  @IsOptional()
  @IsString()
  project?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;
}

export class GeoSearchDto {
  @ApiProperty({ example: -122.4194 })
  @IsNumber()
  lng!: number;

  @ApiProperty({ example: 37.7749 })
  @IsNumber()
  lat!: number;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsNumber()
  dist?: number = 10;
}