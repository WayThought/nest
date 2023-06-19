import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsString
} from 'class-validator'

export class RegisterUserDto {
  @ApiProperty({ description: '邮箱', default: '98903@163.com' })
  @IsString()
  @IsNotEmpty({ message: 'email is empty' })
  email: string

  @ApiProperty({ description: '名称', default: 'vanrio' })
  @IsString()
  @IsNotEmpty({ message: 'username is empty' })
  username: string

  @ApiProperty({ description: '密码', default: '123456' })
  @IsString()
  @IsNotEmpty({ message: 'password is empty' })
  password: string
}