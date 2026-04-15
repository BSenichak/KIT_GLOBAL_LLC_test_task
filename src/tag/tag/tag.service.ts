import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tag, TagDocument } from './entities/tag.entity';
import { CreateTagDto, UpdateTagDto } from './dto';

@Injectable()
export class TagService {
  constructor(
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
  ) {}

  async create(dto: CreateTagDto, userId: string): Promise<TagDocument> {
    const existing = await this.tagModel.findOne({ name: dto.name });
    if (existing) {
      throw new ConflictException('Tag already exists');
    }

    return this.tagModel.create({
      ...dto,
      creator: new Types.ObjectId(userId),
    });
  }

  async findAll(): Promise<TagDocument[]> {
    return this.tagModel.find().populate('creator', 'name email');
  }

  async findOne(id: string): Promise<TagDocument> {
    const tag = await this.tagModel.findById(id).populate('creator', 'name email');
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    return tag;
  }

  async update(id: string, dto: UpdateTagDto): Promise<TagDocument> {
    const tag = await this.tagModel.findByIdAndUpdate(id, dto, { new: true });
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    return tag;
  }

  async remove(id: string): Promise<void> {
    const result = await this.tagModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Tag not found');
    }
  }
}