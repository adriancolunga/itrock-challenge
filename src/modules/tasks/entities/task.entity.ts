import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { IsBoolean, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Entity()
@Unique(['title'])
export class Task {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty()
  id: string;

  @Column()
  @IsString()
  @ApiProperty()
  title: string;

  @Column({ default: null })
  @IsString()
  @ApiProperty()
  description: string;

  @Column({ default: false })
  @IsBoolean()
  @ApiProperty()
  completed: boolean;

  @Column({ type: 'enum', enum: Priority, default: Priority.LOW })
  @IsEnum(Priority)
  @ApiProperty()
  priority: Priority;

  @Column({ default: null })
  @ApiProperty()
  userId: string;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
