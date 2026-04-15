import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type TagDocument = Tag & Document;

@Schema({ timestamps: true })
export class Tag {
  @ApiProperty({ example: 'bug' })
  @Prop({ required: true, unique: true, trim: true, index: true })
  name!: string;

  @ApiProperty({ example: '#ff0000' })
  @Prop({ trim: true })
  color!: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  creator!: Types.ObjectId;
}

export const TagSchema = SchemaFactory.createForClass(Tag);