import { User } from '../domains/user';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  id: string;

  @Column()
  password: string;

  static of(user: User): Readonly<UserEntity> {
    const entity = new UserEntity();
    entity.id = user.id;
    entity.password = user.password;
    return entity;
  }

  toDomain(): User {
    return new User(this.id, this.password);
  }
}
