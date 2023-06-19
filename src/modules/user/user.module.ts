import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { JwtModule, JwtService } from "@nestjs/jwt";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule
  ],
  controllers: [UserController],
  providers: [
    UserService,
    JwtService
  ],
  exports: [
    TypeOrmModule,
    JwtModule
  ],
})
export class UserModule { }
