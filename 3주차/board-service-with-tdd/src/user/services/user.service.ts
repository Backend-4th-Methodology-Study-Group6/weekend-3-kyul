import { Inject, Injectable } from '@nestjs/common';
import { User } from '../domains/user';
import { UserRepository } from '../domains/user.repository';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async create(id: string, password: string): Promise<User> {
    let user = User.create(id, password);
    user = await this.userRepository.save(user);
    return user;
  }

  async findById(id: string): Promise<User> {
    let user = await this.userRepository.findById(id);
    return user;
  }
}
