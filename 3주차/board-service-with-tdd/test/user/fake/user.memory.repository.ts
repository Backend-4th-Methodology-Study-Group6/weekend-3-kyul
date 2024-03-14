import { User } from '../../../src/user/domains/user';
import { UserRepository } from '../../../src/user/domains/user.repository';

export class UserMemoryRepository implements UserRepository {
  private seq: number = 1;
  private userMap: Map<number, User> = new Map<number, User>();

  async findById(id: string): Promise<User> {
    const users = this.userMap.values();
    let user: User;
    for (const _user of users) {
      if (_user.id === id) {
        user = _user;
        break;
      }
    }
    return user;
  }

  async save(user: User): Promise<User> {
    this.userMap.set(this.seq, user);
    const savedUser = this.userMap.get(this.seq);
    this.seq = this.seq + 1;
    return savedUser;
  }
}
