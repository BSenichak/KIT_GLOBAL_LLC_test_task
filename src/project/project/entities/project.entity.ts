import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @ApiProperty({ example: 'My Project' })
  @Prop({ required: true, trim: true })
  name!: string;

  @ApiProperty({ example: 'Project description' })
  @Prop({ trim: true })
  description!: string;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  owner!: Types.ObjectId;

  @ApiProperty()
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  members!: Types.ObjectId[];

  @ApiProperty()
  @Prop({ default: true })
  isActive!: boolean;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);