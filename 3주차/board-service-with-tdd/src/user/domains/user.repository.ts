import { User } from './user';

export interface UserRepository {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User>;
}
