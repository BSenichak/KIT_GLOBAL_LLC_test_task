import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project, ProjectDocument } from './entities/project.entity';
import { CreateProjectDto, UpdateProjectDto } from './dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async create(dto: CreateProjectDto, userId: string): Promise<ProjectDocument> {
    return this.projectModel.create({
      ...dto,
      owner: new Types.ObjectId(userId),
    });
  }

  async findAll(userId: string): Promise<ProjectDocument[]> {
    return this.projectModel.find({
      $or: [
        { owner: new Types.ObjectId(userId) },
        { members: new Types.ObjectId(userId) },
      ],
      isActive: true,
    });
  }

  async findOne(id: string, userId: string): Promise<ProjectDocument> {
    const project = await this.projectModel.findById(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    if (!project.owner.equals(userId) && !project.members.some(m => m.equals(userId))) {
      throw new ForbiddenException('Access denied');
    }
    return project;
  }

  async update(
    id: string,
    dto: UpdateProjectDto,
    userId: string,
  ): Promise<ProjectDocument> {
    const project = await this.findOne(id, userId);
    if (!project.owner.equals(userId)) {
      throw new ForbiddenException('Only owner can update project');
    }
    const updated = await this.projectModel.findByIdAndUpdate(id, dto, { new: true });
    return updated!;
  }

  async remove(id: string, userId: string): Promise<void> {
    const project = await this.findOne(id, userId);
    if (!project.owner.equals(userId)) {
      throw new ForbiddenException('Only owner can delete project');
    }
    await this.projectModel.findByIdAndUpdate(id, { isActive: false });
  }

  async addMember(id: string, memberId: string, userId: string): Promise<ProjectDocument> {
    const project = await this.findOne(id, userId);
    if (!project.owner.equals(userId)) {
      throw new ForbiddenException('Only owner can add members');
    }
    if (!project.members.some(m => m.equals(memberId))) {
      project.members.push(new Types.ObjectId(memberId));
      await project.save();
    }
    return project;
  }

  async removeMember(id: string, memberId: string, userId: string): Promise<ProjectDocument> {
    const project = await this.findOne(id, userId);
    if (!project.owner.equals(userId)) {
      throw new ForbiddenException('Only owner can remove members');
    }
    project.members = project.members.filter(m => !m.equals(memberId));
    await project.save();
    return project;
  }
}