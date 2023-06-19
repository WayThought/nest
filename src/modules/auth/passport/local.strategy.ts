import { PassportStrategy } from '@nestjs/passport';
import { IStrategyOptions, Strategy } from 'passport-local';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/modules/user/entity/user.entity';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

export class LocalStorage extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    } as IStrategyOptions)
  }

  async validate(email: string, password: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email=:email', { email })
      .getOne()

    if (!user) {
      throw new BadRequestException('邮箱不存在！')
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('密码错误！')
    }

    return user
  }
}
