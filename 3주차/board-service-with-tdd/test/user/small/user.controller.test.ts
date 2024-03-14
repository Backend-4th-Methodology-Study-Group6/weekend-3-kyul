import { UserService } from '../../../src/user/services/user.service';
import { UserMemoryRepository } from '../fake/user.memory.repository';
import { UserController } from '../../../src/user/controllers/user.controller';
import { UserCreateDto } from '../../../src/user/controllers/dtos/user.create.dto';

describe(`유저 컨트롤러`, () => {
  const userRepository = new UserMemoryRepository();
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);

  it(`⭕️ 유저를 생성할 수 있음`, async () => {
    const data: UserCreateDto = {
      id: 'test1234',
      password: 'test1234!@#',
    };

    const user = await userController.create(data);

    expect(user).not.toBeNull();
    expect(user.id).toBe(data.id);
    expect(user.password).toBe(data.password);
  });
  it(`⭕️ 유저를 조회할 수 있음`, async () => {
    const id = 'test1234';

    const user = await userController.findById(id);

    expect(user).not.toBeNull();
    expect(user.id).toBe(id);
    expect(user.password).not.toBeUndefined();
  });
});
