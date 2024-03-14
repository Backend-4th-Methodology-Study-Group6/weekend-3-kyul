import { Test, TestingModule } from '@nestjs/testing';
import { UserTypeOrmRepository } from '../../../src/user/infrastructures/user.typeorm.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../../src/user/infrastructures/user.entity';
import { TypeOrmConfig } from '../../../src/config/typeorm.config';
import { UserRepository } from '../../../src/user/domains/user.repository';
import { User } from '../../../src/user/domains/user';

describe(`유저 서비스`, () => {
  let userRepository: UserRepository;
  let userModule: TestingModule;

  beforeEach(async () => {
    userModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(TypeOrmConfig),
        TypeOrmModule.forFeature([UserEntity]),
      ],
      providers: [
        {
          provide: 'UserRepository',
          useClass: UserTypeOrmRepository,
        },
      ],
    }).compile();

    userRepository = userModule.get<UserRepository>('UserRepository');
  });

  it(`⭕️ 유저를 생성할 수 있음`, async () => {
    const id = 'test1234';
    const password = 'test1234!';

    const user = await userRepository.save(User.create(id, password));

    expect(user.id).toBe(id);
  });

  afterEach(() => {
    userModule.close();
  });
});
