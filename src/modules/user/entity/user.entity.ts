import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from "typeorm"
import { generateUid, generateInvitationCode } from "src/utils/cryptogram.util";
import { Exclude } from 'class-transformer';
import { ApiProperty } from "@nestjs/swagger";
import * as bcrypt from 'bcryptjs';

export enum UserRole {
    ROOT = 'root',
    GENERAL = 'general',
    VISITOR = 'visitor'
}

@Entity('user')
export class UserEntity {
    @Exclude()
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number

    @ApiProperty({ description: '用户UID' })
    @Column('varchar', { length: 128, unique: true })
    uid: string

    @ApiProperty({ description: '用户名字' })
    @Column('varchar', { length: 100, unique: true })
    username: string

    @ApiProperty({ description: '用户昵称' })
    @Column('varchar', { length: 100 })
    nickname: string

    @Exclude()
    @Column('varchar')
    password: string

    @ApiProperty({ description: '用户头像' })
    @Column('varchar')
    avatar: string

    @ApiProperty({ description: '用户邮箱' })
    @Column('varchar', { unique: true })
    email: string

    @ApiProperty({ description: '用户角色' })
    @Column({ type: 'enum', enum: UserRole, default: UserRole.GENERAL })
    role: string

    @ApiProperty({ description: '用户创建时间' })
    @Column({
        name: 'create_time',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createTime: Date

    @ApiProperty({ description: '用户更新时间' })
    @Column({
        name: 'update_time',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updateTime: Date

    @ApiProperty({ description: '邀请码' })
    @Column({
        name: 'invitation_code',
        type: 'varchar',
        length: 64,
        unique: true,
    })
    invitationCode: string

    @BeforeInsert()
    async encryptPwd() {
        this.password = bcrypt.hashSync(this.password, 10)
    }

    @BeforeInsert()
    async generateUid() {
        const hash = generateUid(this.email)
        this.uid = hash.toUpperCase()
    }

    @BeforeInsert()
    async generateInvitationCode() {
        const date = new Date()
        const hash = generateInvitationCode(this.email + date.toLocaleTimeString())
        this.invitationCode = hash.toUpperCase()
    }
}
