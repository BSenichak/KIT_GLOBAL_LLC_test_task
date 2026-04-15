import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto, SearchTaskDto, GeoSearchDto } from './dto';
import { TaskStatus } from './entities/task.entity';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created' })
  create(@Body() dto: CreateTaskDto, @Query('userId') userId: string) {
    return this.taskService.create(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks with filters' })
  @ApiResponse({ status: 200, description: 'List of tasks' })
  findAll(@Query() filters: SearchTaskDto) {
    return this.taskService.findAll(filters, '');
  }

  @Get('search')
  @ApiOperation({ summary: 'Text search on tasks' })
  @ApiResponse({ status: 200, description: 'Search results' })
  search(@Query() searchDto: SearchTaskDto) {
    return this.taskService.search(searchDto);
  }

  @Get('near')
  @ApiOperation({ summary: 'Find tasks near location' })
  @ApiResponse({ status: 200, description: 'Tasks near location' })
  findNear(@Query() geoDto: GeoSearchDto) {
    return this.taskService.findNear(geoDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiResponse({ status: 200, description: 'Task found' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task' })
  @ApiResponse({ status: 200, description: 'Task updated' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.taskService.update(id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update task status' })
  @ApiResponse({ status: 200, description: 'Status updated' })
  updateStatus(@Param('id') id: string, @Body('status') status: TaskStatus) {
    return this.taskService.updateStatus(id, status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete task' })
  @ApiResponse({ status: 204, description: 'Task deleted' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  remove(@Param('id') id: string) {
    return this.taskService.remove(id);
  }

  @Post(':id/subtasks')
  @ApiOperation({ summary: 'Add subtask to task' })
  @ApiResponse({ status: 201, description: 'Subtask added' })
  addSubTask(@Param('id') id: string, @Body('subTaskId') subTaskId: string) {
    return this.taskService.addSubTask(id, subTaskId);
  }

  @Post(':id/tags')
  @ApiOperation({ summary: 'Add tag to task' })
  @ApiResponse({ status: 201, description: 'Tag added' })
  addTag(@Param('id') id: string, @Body('tagId') tagId: string) {
    return this.taskService.addTag(id, tagId);
  }

  @Delete(':id/tags/:tagId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove tag from task' })
  @ApiResponse({ status: 204, description: 'Tag removed' })
  removeTag(@Param('id') id: string, @Param('tagId') tagId: string) {
    return this.taskService.removeTag(id, tagId);
  }
}