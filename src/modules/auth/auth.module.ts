import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStorage } from './passport/local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { JwtStorage } from './passport/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          secret: config.get('jwt.secret'),
          signOptions: { expiresIn: '7 days' },
        };
      },
    }),
    PassportModule
  ],
  controllers: [
    AuthController
  ],
  providers: [
    AuthService,
    LocalStorage,
    JwtStorage
  ],
  exports: [
    TypeOrmModule,
    JwtModule,
    PassportModule
  ]
})
export class AuthModule { }
