import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/entity/user.entity';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    private readonly redis: Redis

    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService,
        private readonly redisService: RedisService
    ) {
        this.redis = this.redisService.getClient()
    }

    createToken(user: Partial<UserEntity>) {
        return this.jwtService.sign(user)
    }

    async login(user: Partial<UserEntity>) {
        const accessToken = this.createToken({
            uid: user.uid,
            username: user.username,
            email: user.email,
            role: user.role
        })

        const refreshToken = this.createToken({
            uid: user.uid
        })

        await this.redis.set(`${user.uid}-ACCESS`, accessToken, 'EX', 60 * 60 * 24 * 7)
        await this.redis.set(`${user.uid}-REFRESH`, refreshToken, 'EX', 60 * 60 * 24 * 30)
        return { accessToken, refreshToken }
    }

    async refreshToken(dto: RefreshTokenDto): Promise<any> {
        try {
            const user: any = this.jwtService.decode(dto.refreshToken)
            const { uid } = user
            const existUser = await this.userRepository.findOne({
                where: { uid }
            })

            if (!existUser) {
                throw new UnauthorizedException('token invalid')
            }

            const accessToken = this.createToken({
                uid: user.uid,
                username: user.username,
                email: user.email,
                role: user.role
            })

            const refreshToken = this.createToken({
                uid: user.uid
            })

            await this.redis.set(`${user.uid}-ACCESS`, accessToken, 'EX', 60 * 60 * 24 * 7)
            await this.redis.set(`${user.uid}-REFRESH`, refreshToken, 'EX', 60 * 60 * 24 * 30)
            return { accessToken, refreshToken }
        } catch (err) {
            throw err || new UnauthorizedException('token invalid')
        }
    }
}
