import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { ApiKeyGuard, AuthenticationGuard } from 'src/common/guards';
import { AuthApi, Roles } from 'src/common/guards/roles-auth.guard';
import { Task } from './entities/task.entity';
import { CreateTaskDto, FindAllDTO, UpdateTaskDto } from './dtos';
import { unauthorizedResponse } from 'src/common/api-unauthorized-response';

@Controller('tasks')
@ApiTags('tasks')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Unauthorized Request',
  example: unauthorizedResponse,
})
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  @ApiOkResponse({ description: 'OK' })
  findAll(@Req() req, @Query() dto: FindAllDTO) {
    return this.tasksService.findAll(req.user.id, {
      ...dto,
      route: `http://localhost:3000/tasks`,
    });
  }

  @Get('populate')
  @UseGuards(ApiKeyGuard)
  @ApiOkResponse({ description: 'OK', type: Task, isArray: true })
  populate(): Promise<Task[]> {
    return this.tasksService.populate();
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  @ApiOkResponse({ description: 'OK', type: Task })
  findOne(@Param('id') id: string, @Req() req): Promise<Task> {
    return this.tasksService.findOne(id, req.user.id);
  }

  @Post()
  @UseGuards(AuthenticationGuard)
  @ApiOkResponse({ description: 'OK', type: Task })
  create(@Body() dto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(dto);
  }

  @Patch(':id')
  @AuthApi(Roles.OWNER)
  @ApiOkResponse({ description: 'OK', type: Task })
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto): Promise<Task> {
    return this.tasksService.update(id, dto);
  }

  @Delete(':id')
  @AuthApi(Roles.OWNER, Roles.ADMIN)
  remove(@Param('id') id: string): Promise<string> {
    return this.tasksService.remove(id);
  }
}
