import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  @ApiProperty({ example: 'This is a comment' })
  @Prop({ required: true, trim: true })
  content!: string;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'Task', required: true, index: true })
  task!: Types.ObjectId;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  author!: Types.ObjectId;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);