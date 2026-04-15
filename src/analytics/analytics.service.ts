import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task } from '../task/entities/task.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
  ) {}

  async getTasksByStatus(projectId: string) {
    return this.taskModel.aggregate([
      { $match: { project: new Types.ObjectId(projectId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  async getTasksByUser(projectId: string) {
    return this.taskModel.aggregate([
      { $match: { project: new Types.ObjectId(projectId) } },
      {
        $group: {
          _id: '$assignee',
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'DONE'] }, 1, 0] },
          },
          inProgressTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'IN_PROGRESS'] }, 1, 0] },
          },
          todoTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'TODO'] }, 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          userName: '$user.name',
          email: '$user.email',
          totalTasks: 1,
          completedTasks: 1,
          inProgressTasks: 1,
          todoTasks: 1,
        },
      },
    ]);
  }

  async getTasksByTag(projectId: string) {
    return this.taskModel.aggregate([
      { $match: { project: new Types.ObjectId(projectId) } },
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'DONE'] }, 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: 'tags',
          localField: '_id',
          foreignField: '_id',
          as: 'tag',
        },
      },
      { $unwind: '$tag' },
      {
        $project: {
          tagName: '$tag.name',
          tagColor: '$tag.color',
          totalTasks: 1,
          completedTasks: 1,
          completionRate: {
            $cond: [
              { $eq: ['$totalTasks', 0] },
              0,
              {
                $multiply: [
                  { $divide: ['$completedTasks', '$totalTasks'] },
                  100,
                ],
              },
            ],
          },
        },
      },
    ]);
  }

  async getUpcomingDeadlines(projectId: string, daysAhead: number = 7) {
    const now = new Date();
    const futureDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

    return this.taskModel.aggregate([
      {
        $match: {
          project: new Types.ObjectId(projectId),
          deadline: { $ne: null, $gte: now, $lte: futureDate },
          isCompleted: false,
        },
      },
      {
        $project: {
          title: 1,
          deadline: 1,
          status: 1,
          daysUntilDeadline: {
            $divide: [{ $subtract: ['$deadline', now] }, 24 * 60 * 60 * 1000],
          },
        },
      },
      { $sort: { deadline: 1 } },
    ]);
  }

  async getProjectStats(projectId: string) {
    const [tasksByStatus, tasksByTag, upcomingDeadlines] = await Promise.all([
      this.getTasksByStatus(projectId),
      this.getTasksByTag(projectId),
      this.getUpcomingDeadlines(projectId, 7),
    ]);

    const totalTasks = await this.taskModel.countDocuments({
      project: new Types.ObjectId(projectId),
    });

    return {
      totalTasks,
      tasksByStatus,
      tasksByTag,
      upcomingDeadlines,
    };
  }
}