import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './entities/comment.entity';
import { CreateCommentDto, UpdateCommentDto } from './dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async create(dto: CreateCommentDto, userId: string): Promise<CommentDocument> {
    return this.commentModel.create({
      content: dto.content,
      task: new Types.ObjectId(dto.task),
      author: new Types.ObjectId(userId),
    });
  }

  async findByTask(taskId: string): Promise<CommentDocument[]> {
    return this.commentModel
      .find({ task: new Types.ObjectId(taskId) })
      .populate('author', 'name email')
      .sort({ createdAt: 1 });
  }

  async findOne(id: string): Promise<CommentDocument> {
    const comment = await this.commentModel.findById(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async update(
    id: string,
    dto: UpdateCommentDto,
    userId: string,
  ): Promise<CommentDocument> {
    const comment = await this.findOne(id);

    if (!comment.author.equals(userId)) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    const updated = await this.commentModel.findByIdAndUpdate(
      id,
      { content: dto.content },
      { new: true },
    );
    return updated!;
  }

  async remove(id: string, userId: string): Promise<void> {
    const comment = await this.findOne(id);

    if (!comment.author.equals(userId)) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentModel.findByIdAndDelete(id);
  }
}