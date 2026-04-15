import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './entities/UserEntity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
  ) { }

  async create(data: any) {
    return this.userModel.create(data);
  }

  findOne(email: string) {
    return this.userModel.findOne({ email });
  }

  async findAll() {
    return this.userModel.find();
  }
}