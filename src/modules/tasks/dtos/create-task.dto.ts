import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Priority } from '../entities/task.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Title 1' })
  title: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Title description' })
  description: string;

  @IsNotEmpty()
  @IsEnum(Priority)
  @ApiProperty({ example: Priority })
  priority: Priority;
}
