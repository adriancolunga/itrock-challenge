import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { log } from 'console';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { FindAllDTO } from './dtos';
import { paginate } from 'nestjs-typeorm-paginate';
import { ConfigService } from '@nestjs/config';
import { IWhereClause } from 'src/common/interfaces';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class TasksService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async populate(): Promise<Task[]> {
    const tasks: Task[] = [];
    const todos = await (
      await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'GET',
      })
    ).json();

    await Promise.all(
      todos.map(async (todo) => {
        try {
          const task = await this.taskRepository.save(todo);
          tasks.push(task);
        } catch (error) {
          if (error.code === '23505') return;
          else throw new InternalServerErrorException(error);
        }
      }),
    );

    return tasks;
  }

  async findAll(userId: string, dto: FindAllDTO) {
    const cacheOn = this.configService.get('CACHE_ON');
    let clause: IWhereClause = { where: { userId } };

    if (dto) {
      if (dto.completed)
        clause.where = { ...clause.where, completed: dto.completed };
      if (dto.priority)
        clause.where = { ...clause.where, priority: dto.priority };
    }

    if (cacheOn === 'true') {
      const cachedTasks = await this.cacheManager.get('tasks');
      if (cachedTasks) {
        this.logger.info('Tareas desde caché');
        return cachedTasks;
      }

      this.logger.info('Tareas desde base de datos');
      const tasks = await paginate(
        this.taskRepository,
        { page: dto.page, limit: dto.limit, route: dto.route },
        clause,
      );
      await this.cacheManager.set('tasks', tasks, 600000);

      return tasks;
    }

    return await paginate(
      this.taskRepository,
      { page: dto.page, limit: dto.limit, route: dto.route },
      clause,
    );
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id, userId } });
    if (!task)
      throw new NotFoundException('Task not found or its not assigned to you');

    return task;
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    try {
      const task = await this.taskRepository.save(dto);
      this.eventEmitter.emit('TASK_CREATED', task);

      return task;
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException('Task already exists');
      else throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    await this.taskRepository.update(id, dto);
    if (dto.completed === true) this.eventEmitter.emit('TASK_COMPLETED', id);

    return await this.taskRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<string> {
    const task = await this.taskRepository.delete(id);
    if (task.affected === 0) throw new NotFoundException('Task not found');
    else return 'Done';
  }
}
