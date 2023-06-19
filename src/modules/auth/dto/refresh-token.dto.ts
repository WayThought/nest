import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsString
} from 'class-validator'

export class RefreshTokenDto {
  @ApiProperty({ description: 'refreshToken', default: '' })
  @IsString()
  @IsNotEmpty({ message: 'refreshToken is empty' })
  refreshToken: string
}