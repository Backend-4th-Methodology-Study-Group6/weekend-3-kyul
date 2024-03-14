import { Injectable } from '@nestjs/common';
import { User } from '../domains/user';
import { UserRepository } from '../domains/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserTypeOrmRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async save(user: User): Promise<User> {
    return (await this.userRepository.save(UserEntity.of(user))).toDomain();
  }
  async findById(id: string): Promise<User> {
    return (await this.userRepository.findOneBy({ id: id })).toDomain();
  }
}
