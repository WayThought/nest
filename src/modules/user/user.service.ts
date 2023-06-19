import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity, UserRole } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) { }

    async register(registerUser: RegisterUserDto): Promise<any> {
        const { email, username, password } = registerUser
        const existUserOfEmail = await this.userRepository.findOne({
            where: { email },
        })

        if (existUserOfEmail) {
            throw new HttpException("邮箱已存在", HttpStatus.BAD_REQUEST)
        }

        const existUserOfUname = await this.userRepository.findOne({
            where: { username },
        })

        if (existUserOfUname) {
            throw new HttpException("用户名已存在", HttpStatus.BAD_REQUEST)
        }

        var userEntity = new UserEntity()
        userEntity.username = username
        userEntity.nickname = username
        userEntity.password = password
        userEntity.role = UserRole.GENERAL
        userEntity.email = email
        userEntity.avatar = ''

        const newUser = this.userRepository.create(userEntity)
        return await this.userRepository.save(newUser)
    }
}
