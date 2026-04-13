import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { AddUserDto } from './entities/User.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'list of users' })
    @Get()
    getUsers() {
        return this.userService.findAll()
    }

    @ApiOperation({ summary: 'create a new user' })
    @ApiResponse({ status: 200, description: 'User created' })
    @Post()
    addOneUser(@Body() data: AddUserDto) {
        return this.userService.create(data)
    }
}
