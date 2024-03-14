import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../src/user/services/user.service';
import { UserTypeOrmRepository } from '../../../src/user/infrastructures/user.typeorm.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../../src/user/infrastructures/user.entity';
import { TypeOrmConfig } from '../../../src/config/typeorm.config';

describe(`유저 서비스`, () => {
  let userService: UserService;
  let userModule: TestingModule;

  beforeEach(async () => {
    userModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(TypeOrmConfig),
        TypeOrmModule.forFeature([UserEntity]),
      ],
      providers: [
        UserService,
        {
          provide: 'UserRepository',
          useClass: UserTypeOrmRepository,
        },
      ],
    }).compile();

    userService = userModule.get<UserService>(UserService);
  });

  it(`⭕️ 유저를 생성할 수 있음`, async () => {
    // given
    const id = 'test1234';
    const password = 'test1234!';

    // when
    const user = await userService.create(id, password);

    // then
    expect(user).not.toBeNull();
    expect(user.id).toBe(id);
    expect(user.password).toBe(password);
  });

  afterEach(() => {
    userModule.close();
  });
});
