import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'list of users' })
    @Get()
    getUsers() {
        return this.userService.findAll();
    }
}