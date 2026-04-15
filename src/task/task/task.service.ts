import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument, TaskStatus } from './entities/task.entity';
import { CreateTaskDto, UpdateTaskDto, SearchTaskDto, GeoSearchDto } from './dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) {}

  async create(dto: CreateTaskDto, userId: string): Promise<TaskDocument> {
    const taskData: any = {
      title: dto.title,
      description: dto.description,
      status: dto.status || TaskStatus.TODO,
      project: new Types.ObjectId(dto.project),
      assignee: new Types.ObjectId(dto.assignee),
      creator: new Types.ObjectId(userId),
      deadline: dto.deadline ? new Date(dto.deadline) : null,
    };

    if (dto.parentTask) {
      taskData.parentTask = new Types.ObjectId(dto.parentTask);
    }

    if (dto.tags && dto.tags.length > 0) {
      taskData.tags = dto.tags.map(t => new Types.ObjectId(t));
    }

    if (dto.location && dto.location.coordinates) {
      taskData.location = {
        type: 'Point',
        coordinates: dto.location.coordinates,
      };
    }

    return this.taskModel.create(taskData);
  }

  async findAll(
    filters: SearchTaskDto,
    userId: string,
  ): Promise<{ tasks: TaskDocument[]; total: number }> {
    const { status, tag, project, page = 1, limit = 10 } = filters;
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (tag) {
      query.tags = new Types.ObjectId(tag);
    }

    if (project) {
      query.project = new Types.ObjectId(project);
    }

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      this.taskModel
        .find(query)
        .populate('tags')
        .populate('assignee', 'name email')
        .populate('project', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.taskModel.countDocuments(query),
    ]);

    return { tasks, total };
  }

  async findOne(id: string): Promise<TaskDocument> {
    const task = await this.taskModel
      .findById(id)
      .populate('tags')
      .populate('assignee', 'name email')
      .populate('creator', 'name email')
      .populate('project', 'name')
      .populate({
        path: 'subTasks',
        populate: { path: 'tags' },
      });

    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async update(id: string, dto: UpdateTaskDto): Promise<TaskDocument> {
    const updateData: any = { ...dto };

    if (dto.assignee) {
      updateData.assignee = new Types.ObjectId(dto.assignee);
    }

    if (dto.deadline) {
      updateData.deadline = new Date(dto.deadline);
    }

    const task = await this.taskModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('tags')
      .populate('assignee', 'name email');

    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async remove(id: string): Promise<void> {
    const result = await this.taskModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Task not found');
    }
  }

  async updateStatus(id: string, status: TaskStatus): Promise<TaskDocument> {
    return this.update(id, { status } as UpdateTaskDto);
  }

  async addSubTask(parentId: string, subTaskId: string): Promise<TaskDocument> {
    const parentTask = await this.taskModel.findById(parentId);
    if (!parentTask) {
      throw new NotFoundException('Parent task not found');
    }

    const subTask = await this.taskModel.findById(subTaskId);
    if (!subTask) {
      throw new NotFoundException('SubTask not found');
    }

    if (!parentTask.subTasks.some(st => st.equals(subTaskId))) {
      parentTask.subTasks.push(new Types.ObjectId(subTaskId));
      await parentTask.save();
    }

    subTask.parentTask = new Types.ObjectId(parentId);
    await subTask.save();

    return this.findOne(parentId);
  }

  async addTag(taskId: string, tagId: string): Promise<TaskDocument> {
    const task = await this.taskModel.findById(taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (!task.tags.some(t => t.equals(tagId))) {
      task.tags.push(new Types.ObjectId(tagId));
      await task.save();
    }

    return this.findOne(taskId);
  }

  async removeTag(taskId: string, tagId: string): Promise<TaskDocument> {
    const task = await this.taskModel.findById(taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    task.tags = task.tags.filter(t => !t.equals(tagId));
    await task.save();

    return this.findOne(taskId);
  }

  async search(searchDto: SearchTaskDto): Promise<TaskDocument[]> {
    const { q, page = 1, limit = 10 } = searchDto;

    if (!q) {
      return this.findAll(searchDto, '').then(r => r.tasks);
    }

    return this.taskModel
      .find(
        { $text: { $search: q } },
        { score: { $meta: 'textScore' } },
      )
      .sort({ score: { $meta: 'textScore' } })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('tags')
      .populate('assignee', 'name email')
      .populate('project', 'name');
  }

  async findNear(geoDto: GeoSearchDto): Promise<TaskDocument[]> {
    const { lng, lat, dist = 10 } = geoDto;

    return this.taskModel
      .find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat],
            },
            $maxDistance: dist * 1000,
          },
        },
      })
      .populate('tags')
      .populate('assignee', 'name email')
      .populate('project', 'name');
  }
}