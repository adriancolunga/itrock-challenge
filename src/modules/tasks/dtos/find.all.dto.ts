import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { Priority } from '../entities/task.entity';

class PaginationDTO {
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({ default: 1 })
  page: number = 1;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({ default: 10 })
  limit: number = 10;

  @IsString()
  @IsOptional()
  route: string;
}

export class FindAllDTO extends PaginationDTO {
  @IsOptional()
  @IsEnum(Priority)
  @ApiPropertyOptional({ example: 'low | medium | high' })
  priority: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiPropertyOptional({ example: true })
  completed: boolean;
}
