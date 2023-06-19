import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Body, UseInterceptors, ClassSerializerInterceptor, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserEntity } from './entity/user.entity';
import { JwtAuthGuard } from 'src/jwt/jwt.auth.guard';

@ApiTags("用户")
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @ApiOperation({ summary: '用户注册' })
    @ApiResponse({ status: 201, type: UserEntity })
    @ApiBody({ type: RegisterUserDto })
    @UseInterceptors(ClassSerializerInterceptor)
    @Post('register')
    async register(@Body() registerUser: RegisterUserDto): Promise<any> {
        return await this.userService.register(registerUser)
    }

    @ApiOperation({ summary: '获取用户信息' })
    @ApiResponse({ status: 200, type: UserEntity })
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('userInfo')
    async userInfo(@Req() req): Promise<UserEntity> {
        return req.user
    }
}
