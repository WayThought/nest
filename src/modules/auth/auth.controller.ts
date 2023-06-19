import { Controller, UseInterceptors, Post, ClassSerializerInterceptor, Req, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from 'src/jwt/local.auth.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('验证')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @ApiOperation({ summary: '用户登录' })
    @ApiBody({ type: LoginDto })
    @UseGuards(LocalAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Post('login')
    async login(@Req() req): Promise<any> {
        return await this.authService.login(req.user)
    }

    @ApiOperation({ summary: '刷新令牌' })
    @ApiBody({ type: RefreshTokenDto })
    @UseInterceptors(ClassSerializerInterceptor)
    @Post('refreshToken')
    async refreshToken(@Body() dto: RefreshTokenDto): Promise<any> {
        return await this.authService.refreshToken(dto)
    }
}
