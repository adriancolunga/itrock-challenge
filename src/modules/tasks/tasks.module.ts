import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TaskListener } from './tasks.listener';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), CacheModule.register()],
  controllers: [TasksController],
  providers: [TasksService, TaskListener],
})
export class TasksModule {}
