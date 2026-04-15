import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto, LoginDto } from '../user/entities/User.dto';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
    ) { }

    async register(dto: RegisterDto) {
        const candidate = await this.userService.findOne(dto.email);

        if (candidate) {
            throw new ConflictException('User already exists');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.userService.create({
            email: dto.email,
            name: dto.name,
            password: hashedPassword,
        });

        return { id: user._id, email: user.email, name: user.name };
    }

    async login(dto: LoginDto) {
        const user = await this.userService.findOne(dto.email).select('+password');

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user._id, email: user.email };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}