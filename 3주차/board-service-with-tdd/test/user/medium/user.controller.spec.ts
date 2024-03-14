import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../../src/user/controllers/user.controller';
import { UserService } from '../../../src/user/services/user.service';
import { UserTypeOrmRepository } from '../../../src/user/infrastructures/user.typeorm.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from '../../../src/config/typeorm.config';
import { UserEntity } from '../../../src/user/infrastructures/user.entity';

describe(`유저 컨트롤러`, () => {
  let userController: UserController;
  let userModule: TestingModule;

  beforeEach(async () => {
    userModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(TypeOrmConfig),
        TypeOrmModule.forFeature([UserEntity]),
      ],
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: 'UserRepository',
          useClass: UserTypeOrmRepository,
        },
      ],
    }).compile();

    userController = userModule.get<UserController>(UserController);
  });

  it(`⭕️ 유저를 생성할 수 있음`, async () => {
    const data = {
      id: 'test1234',
      password: 'test1234!',
    };

    const user = await userController.create(data);

    expect(user.id).toBe(data.id);
  });

  afterEach(() => {
    userModule.close();
  });
});
