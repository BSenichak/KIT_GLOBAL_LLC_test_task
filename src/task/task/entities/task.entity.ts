import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @ApiProperty({ example: 'Fix bug' })
  @Prop({ required: true, trim: true })
  title!: string;

  @ApiProperty({ example: 'Description of the task' })
  @Prop({ trim: true })
  description!: string;

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.TODO })
  @Prop({
    type: String,
    enum: Object.values(TaskStatus),
    default: TaskStatus.TODO,
    index: true,
  })
  status!: TaskStatus;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'Project', required: true, index: true })
  project!: Types.ObjectId;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  assignee!: Types.ObjectId;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  creator!: Types.ObjectId;

  @ApiProperty({ required: false })
  @Prop({ type: Types.ObjectId, ref: 'Task', default: null, index: true })
  parentTask!: Types.ObjectId | null;

  @ApiProperty()
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Task' }], default: [] })
  subTasks!: Types.ObjectId[];

  @ApiProperty()
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Tag' }], default: [], index: true })
  tags!: Types.ObjectId[];

  @ApiProperty()
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Comment' }], default: [] })
  comments!: Types.ObjectId[];

  @ApiProperty({
    example: { type: 'Point', coordinates: [37.7749, -122.4194] },
    required: false,
  })
  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
  })
  location!: {
    type: 'Point';
    coordinates: number[];
  };

  @ApiProperty({ example: '2025-12-31T23:59:59Z', required: false })
  @Prop({ default: null })
  deadline!: Date | null;

  @ApiProperty()
  @Prop({ default: false })
  isCompleted!: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.index({ description: 'text', title: 'text' });
TaskSchema.index({ location: '2dsphere' });