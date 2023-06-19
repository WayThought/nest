import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { StrategyOptions, Strategy, ExtractJwt } from 'passport-jwt';
import { UserEntity } from 'src/modules/user/entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export class JwtStorage extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('jwt.secret')
    } as StrategyOptions)
  }

  async validate(user: UserEntity) {
    const { uid } = user
    const existUser = await this.userRepository.findOne({
      where: { uid }
    })

    if (!existUser) {
      throw new UnauthorizedException('token invalid')
    }

    return existUser
  }
}
