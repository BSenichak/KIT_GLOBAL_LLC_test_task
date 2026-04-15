import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://user:password@db:27017/mydb?authSource=admin'
    ),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
