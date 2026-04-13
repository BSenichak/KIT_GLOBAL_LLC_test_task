import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from "class-validator"

export class AddUserDto {
    @ApiProperty({ example: 'user' })
    @IsString()
    name!: string;

    @ApiProperty({ example: 'test@gmail.com' })
    @IsEmail()
    email!: string;
}