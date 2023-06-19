import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { RedisService } from '@liaoliaots/nestjs-redis';
import { ExtractJwt } from 'passport-jwt';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
    private readonly redis: Redis

    constructor(
        private reflector: Reflector,
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
        private readonly jwtService: JwtService
    ) {
        super()
        this.redis = this.redisService.getClient()
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const singleSignOn = this.configService.get('auth.singleSignOn')
        if (singleSignOn) {
            const request = context.switchToHttp().getRequest()
            const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request)
            if (token) {
                try {
                    let payload: any = this.jwtService.decode(token)
                    const { uid } = payload
                    const cacheToken = await this.redis.get(`${uid}-ACCESS`)
                    if (!cacheToken || cacheToken != token) {
                        throw new UnauthorizedException('token invalid')
                    }
                } catch (err) {
                    throw err || new UnauthorizedException('token invalid')
                }
            }
            return super.canActivate(context) as boolean
        } else {
            return super.canActivate(context) as boolean
        }
    }

    handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
            throw err || new UnauthorizedException()
        } else {
            return user
        }
    }
}

