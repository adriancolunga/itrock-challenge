import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class TaskListener {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private logger: Logger) {}

  @OnEvent('TASK_CREATED')
  handleTaskCreated(payload: any) {
    this.logger.info(`New task created: ${payload.title}`);
  }

  @OnEvent('TASK_COMPLETED')
  handleTaskCompleted(id: string) {
    this.logger.info(`Task id: ${id} completed`);
  }
}
