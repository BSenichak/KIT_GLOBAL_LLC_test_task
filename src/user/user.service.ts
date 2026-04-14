import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { UserDocument } from './entities/UserEntity';
import { RegisterDto } from './entities/User.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
  ) { }

  async create(data: any) {
    return this.userModel.create(data);
  }

  async findAll() {
    return this.userModel.find();
  }

  async register(dto: RegisterDto) {
    const candidate = await this.userModel.findOne({ email: dto.email });

    if (candidate) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userModel.create({
      email: dto.email,
      name: dto.name,
      password: hashedPassword,
    });

    return user;
  }
}
